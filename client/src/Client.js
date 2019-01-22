"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ramda_1 = require("ramda");
const BigNumberUtils_1 = require("./libs/BigNumberUtils");
const Bookkeeping_1 = require("./bookkeeping/Bookkeeping");
const Identity_1 = require("./identity/Identity");
const ClientBookkeeping_1 = require("./bookkeeping/ClientBookkeeping");
const Errors_1 = require("./Errors");
const SmartContractTypes_1 = require("./SmartContractTypes");
const Contracts_1 = require("./mediator/Contracts");
const ContractUtils_1 = require("./libs/ContractUtils");
const HTTPClient_1 = require("./transport/HTTPClient");
const Logging_1 = require("./Logging");
const logger = Logging_1.loggers.get('frontend');
class Client {
    constructor(assets, identity, transport, options) {
        this.isPollingOperator = true;
        this._isConnected = false;
        this._roundJoined = -1;
        this.assets = assets;
        this.operatorAddress = options.operatorAddress;
        this.identity = identity;
        this.address = identity.address;
        if (typeof transport == 'string') {
            this.transport = new HTTPClient_1.HTTPClient(new URL(transport));
        }
        else {
            this.transport = transport;
        }
        if (typeof options.mediator === 'string') {
            this.mediator = Client.mkMediatorAsync(identity, options.mediator);
        }
        else {
            this.mediator = options.mediator;
        }
        this._round = 0;
        this._quarter = 0;
        this.books = new Map();
        assets.forEach(asset => this.books.set(asset, new ClientBookkeeping_1.ClientBookkeeping(this.address)));
        this.millisecondsBetweenPolling = ramda_1.defaultTo(3000, options.millisecondsBetweenPolling);
        this.eventEmitter = new eventemitter3_1.default();
    }
    static mkMediatorAsync(signer, mediatorAddress) {
        const mediator = ContractUtils_1.getContractFactory('Mediator', signer).attach(mediatorAddress);
        return new Contracts_1.MediatorAsync(signer, mediator);
    }
    get round() {
        return this._round;
    }
    get quarter() {
        return this._quarter;
    }
    setState(state) {
        if (this._isConnected) {
            throw Error('Unable to set state after joining a hub');
        }
        if (state.roundJoined !== undefined) {
            this._roundJoined = state.roundJoined;
        }
    }
    /**
     * Joins layer 2 network
     *
     * @throws {SignatureError}
     */
    async join() {
        const mediatorAddress = await this.transport.mediator();
        if (this.mediator.contractAddress.toLowerCase() !==
            mediatorAddress.toLowerCase()) {
            throw Error(`Operator using Mediator contract at ${mediatorAddress}`);
        }
        await this.ensureRound();
        const admissionHash = Bookkeeping_1.emptyAdmissionDigest();
        const admissionSig = await this.identity.hashAndSign(admissionHash);
        const response = await this.transport.join(admissionSig);
        const countersignature = response.acknowledgement;
        this.validateCountersig(admissionHash, countersignature);
        for (const book of this.books.values()) {
            book.start(this.round);
            book.setAdmissionCountersig(admissionHash, countersignature);
        }
        if (this._roundJoined === -1) {
            this._roundJoined = this.round;
        }
        if (this._roundSize === undefined) {
            this._roundSize = await this.mediator.roundSize();
        }
        this.registerEventListeners();
        this.isOperatorPollingFinished = this.pollOperatorForStateChange();
        this._isConnected = true;
    }
    async leave() {
        this.isPollingOperator = false;
        await this.isOperatorPollingFinished;
        this._isConnected = false;
        const contract = this.mediator.getContractWrapper();
        contract.provider.removeAllListeners('block');
    }
    async deposit(asset, amount, approve) {
        let preconditionError = this.verifyPreconditionsForBook(asset);
        if (preconditionError !== undefined) {
            throw preconditionError;
        }
        // By default, approval must have been given prior to calling deposit
        if (approve) {
            const tokenContract = ContractUtils_1.getContractFactory('ERC20', this.identity).attach(asset);
            const amountString = amount.toString(10);
            const currentAllowance = await tokenContract.functions.allowance(this.identity.address, this.mediator.contractAddress);
            if (currentAllowance.lt(amountString)) {
                const txPromise = tokenContract.functions.approve(this.mediator.contractAddress, amountString);
                await ContractUtils_1.waitForMining(txPromise);
            }
        }
        await this.mediator.depositsToken(asset, amount);
        const book = this.getBook(asset);
        book.deposit(amount);
    }
    verifyPreconditionsForBook(asset) {
        const book = this.getBook(asset);
        let preconditionError = book.verifyDepositPreconditions();
        return preconditionError;
    }
    getBook(asset) {
        const book = this.books.get(asset);
        if (!book) {
            throw Error('Unknown asset ${asset}.');
        }
        return book;
    }
    async isHalted() {
        return this.mediator.isHalted();
    }
    async fetchProof(asset, round) {
        logger.info('Fetching proof from server ...');
        const result = await this.transport.audit(this.address, asset, round);
        const { proof, openingBalance } = result;
        const leaf = { address: this.address, sum: openingBalance };
        return SmartContractTypes_1.Proof.fromProofOfLiability(proof, leaf, asset);
    }
    mkProof(proof, asset) {
        const leaf = this.getBook(asset).account();
        return SmartContractTypes_1.Proof.fromProofOfLiability(proof, leaf, asset);
    }
    async ensureHaltedState(book) {
        const isHalted = await this.isHalted();
        if (isHalted) {
            book.halt();
        }
    }
    async withdraw(asset, amount, withBookkeeping = true) {
        const book = this.getBook(asset);
        await this.ensureHaltedState(book);
        const round = this.round;
        let proof;
        if (withBookkeeping) {
            const error = book.verifyWithdrawalPreconditions(amount, false);
            if (error) {
                throw error;
            }
            const proofOfLiability = book.getProofOfStake(round);
            proof = this.mkProof(proofOfLiability, asset);
        }
        else {
            proof = await this.fetchProof(asset, round);
            const pendingWithdrawals = await this.mediator.pendingWithdrawals(round, asset, this.address);
            if (pendingWithdrawals.gt(0)) {
                throw Error(`Unable to initiate withdrawal. Reason: ` +
                    `A pending withdrawal already exists for this round. Round=${round}`);
            }
        }
        logger.info(`Withdrawing ${BigNumberUtils_1.weiToEther(amount)} of ${asset} at round ${round}`);
        try {
            const receipt = this.mediator.initiateWithdrawal(proof, amount);
            try {
                book.withdraw(amount);
            }
            catch (err) {
                logger.debug(`Bookkeeping could not be updated: ${err.message}`);
            }
            return receipt;
        }
        catch (err) {
            logger.error(`Failed to initiate withdrawal: ${err.message}`);
            throw err;
        }
    }
    async audit() {
        const round = this.round;
        this.assets.forEach(async (asset) => await this.auditAsset(asset, round));
        this.eventEmitter.emit('auditComplete');
        return Promise.resolve();
    }
    async auditAsset(asset, round) {
        const book = this.getBook(asset);
        if (book.getProofOfStake(round) != undefined) {
            return;
        }
        try {
            const result = await this.transport.audit(this.address, asset, round);
            await this.verifyProof(asset, result.proof, round);
            this.eventEmitter.emit('audit', result);
        }
        catch (err) {
            logger.error(`Auditing failed: ${err.message}`);
            return;
        }
    }
    async verifyProof(asset, proofOfLiability, round) {
        const proofRound = round === undefined ? this.round : round;
        const book = this.getBook(asset);
        const leaf = book.account(proofRound);
        const proof = SmartContractTypes_1.Proof.fromProofOfLiability(proofOfLiability, leaf, asset);
        // round zero never has a root
        if (round == 0) {
            return;
        }
        if (!(await this.mediator.isProofValid(proof, proofRound))) {
            // too noisy
            throw Error(`Invalid Proof Of Stake for asset ${asset} at round ${round}`);
        }
        book.setProofOfStake(proofOfLiability);
    }
    goToRound(round) {
        this._round = round;
        this.books.forEach(book => book.goToRound(round));
    }
    async ensureRound() {
        const round = await this.mediator.getCurrentRound();
        if (round != this.round) {
            await this.goToRound(round);
        }
    }
    async ensureQuarter() {
        const quarter = await this.mediator.getCurrentQuarter();
        if (quarter != this.quarter) {
            await this.goToQuarter(this.round, quarter);
        }
    }
    async confirmWithdrawal(asset) {
        await this.ensureRound();
        let currentRound = this.round;
        for (let round = 0; round < currentRound; round++) {
            const roundToTry = this.round - 2 - round;
            if (roundToTry >= 1) {
                logger.info(`Checking round ${roundToTry}`);
                const pending = await this.mediator.pendingWithdrawals(roundToTry, asset, this.address);
                if (pending.gt(BigNumberUtils_1.D('0'))) {
                    logger.info(`Confirming withdrawal amount=${BigNumberUtils_1.weiToEther(pending)}.`);
                    await this.mediator.confirmWithdrawal(roundToTry, asset);
                    logger.info(`Withdrawal confirmed.`);
                    return;
                }
            }
        }
        logger.info(`No withdrawals to confirm.`);
    }
    async goToQuarter(round, quarter) {
        this._quarter = quarter;
        logger.info(`Going to round=${round} quarter=${quarter}`);
        for (const [asset, book] of this.books) {
            book.goToQuarter(round, quarter);
            // TODO: probably better to return the round(s) for which we can withdraw
            const canWithdraw = this.round >= 2 && book.hasExecutableWithdrawals(round);
            if (canWithdraw) {
                logger.info(`Confirming withdrawal of asset ${asset} from round ${round - 2}`);
                try {
                    await this.mediator.confirmWithdrawal(round - 2, asset);
                    logger.info(`Confirming withdrawal ok`);
                }
                catch (err) {
                    logger.info(`Confirming withdrawal failed: ${err.message}`);
                }
            }
        }
    }
    on(eventName, callback) {
        this.eventEmitter.on(eventName, callback);
    }
    once(eventName, callback) {
        this.eventEmitter.once(eventName, callback);
    }
    get roundJoined() {
        return this._roundJoined;
    }
    get isConnected() {
        return this._isConnected;
    }
    get roundSize() {
        return this._roundSize;
    }
    validateCountersig(msg, countersig) {
        const signingAddress = this.operatorAddress;
        const preamble = 'Failed to ienterify countersignature';
        let result;
        try {
            result = Identity_1.verifyMessageSig(msg, countersig, signingAddress);
        }
        catch (err) {
            throw new Errors_1.SignatureError(`${preamble}: ${err.message}`);
        }
        if (result !== undefined && !result) {
            throw new Errors_1.SignatureError(`${preamble}: signature mismatch`);
        }
    }
    registerEventListeners() {
        // TODO consolidate with same function in Operator?
        const contract = this.mediator.getContractWrapper();
        contract.provider.on('block', async (blockNumber) => {
            logger.info(`New block ${blockNumber}`);
            await this.ensureRound();
            await this.ensureQuarter();
        });
        // TODO needs indexing of event
        // const myWithdrawals = contract.filters.InitWithdrawal(
        //   null,
        //   null,
        //   this.address,
        //   null
        // )
        // contract.on('InitWithdrawal', (...event: ContractEvent) => {
        //   const address = event[2]
        //   if (address === this.address) {
        //     const asset = event[1]
        //     const amount = ethersBNToBigNumber(event[3])
        //     logger.info('InitWithdrawal asset=${asset} amount=${amount}')
        //     const book = this.getBook(asset)
        //     // withdaw should support round
        //     book.withdraw(amount)
        //   }
        // })
    }
    async pollOperatorForStateChange() {
        this.isPollingOperator = true;
        const pollOperator = (resolve) => {
            if (this.isPollingOperator && this.millisecondsBetweenPolling > 0) {
                if (this.round !== this._roundJoined) {
                    this.audit().then(() => {
                        setTimeout(pollOperator, this.millisecondsBetweenPolling, resolve);
                    });
                }
                else {
                    setTimeout(pollOperator, this.millisecondsBetweenPolling, resolve);
                }
            }
            else {
                resolve();
            }
        };
        return new Promise(pollOperator);
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOzs7OztBQUcvRSxrRUFBd0M7QUFDeEMsaUNBQWlDO0FBRWpDLDBEQUFxRDtBQUNyRCwyREFBZ0U7QUFTaEUsa0RBQXNEO0FBRXRELHVFQUFtRTtBQUduRSxxQ0FBeUM7QUFDekMsNkRBQTRDO0FBQzVDLG9EQUFvRDtBQUVwRCx3REFBd0U7QUFDeEUsdURBQW1EO0FBQ25ELHVDQUFtQztBQUduQyxNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQXFDdEMsTUFBYSxNQUFNO0lBZ0NqQixZQUNFLE1BQXNCLEVBQ3RCLFFBQWtCLEVBQ2xCLFNBQW1DLEVBQ25DLE9BQXNCO1FBbkN4QixzQkFBaUIsR0FBWSxJQUFJLENBQUE7UUFVekIsaUJBQVksR0FBWSxLQUFLLENBQUE7UUFNN0IsaUJBQVksR0FBVSxDQUFDLENBQUMsQ0FBQTtRQXFCOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFBO1FBQzlDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQTtRQUMvQixJQUFJLE9BQU8sU0FBUyxJQUFJLFFBQVEsRUFBRTtZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1NBQ3BEO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQTRCLENBQUE7U0FDOUM7UUFDRCxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsS0FB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