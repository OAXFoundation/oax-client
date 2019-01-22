"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ramda_1 = require("ramda");
const Collections_1 = require("../libs/Collections");
const Bookkeeping_1 = require("./Bookkeeping");
const BigNumberUtils_1 = require("../libs/BigNumberUtils");
const SerDe_1 = require("../SerDe");
class ClientBookkeeping {
    constructor(address) {
        this._firstRound = 0;
        this._round = 0;
        this._isHalted = false;
        this.transfers = new Collections_1.DefaultDict(() => []);
        this.deposits = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`);
        this.pendingWithdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`);
        this.confirmedWithdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`);
        this.admissionSigs = new Map();
        this.admissionCountersigs = new Map();
        this.proofOfLiabilities = new Map();
        this.transacted = new Map();
        this.address = address;
    }
    static fromJSON(json) {
        const book = new ClientBookkeeping(json.address);
        book._firstRound = json.firstRound;
        book._round = json.round;
        book._isHalted = json.isHalted;
        book.deposits = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`, json.deposits.map(([round, amount]) => [
            round,
            new bignumber_js_1.default(amount)
        ]));
        book.pendingWithdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`, json.pendingWithdrawals.map(([round, amount]) => [
            round,
            new bignumber_js_1.default(amount)
        ]));
        book.confirmedWithdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`, json.confirmedWithdrawals.map(([round, amount]) => [
            round,
            new bignumber_js_1.default(amount)
        ]));
        book.admissionSigs = new Map(json.admissionSigs);
        book.admissionCountersigs = new Map(json.admissionCountersigs);
        book.proofOfLiabilities = new Map(json.proofOfLiabilities.map(([round, liabilities]) => [
            round,
            liabilities.map(SerDe_1.LiabilitySerDe.fromJSON)
        ]));
        json.transfers.forEach(([round, transferJsons]) => {
            const transfers = transferJsons.map(SerDe_1.TransferSerDe.fromJSON);
            transfers.forEach(transfer => {
                book.addInstantTransfer(transfer, round);
            });
        });
        return book;
    }
    toJSON() {
        return JSON.parse(JSON.stringify({
            address: this.address,
            firstRound: this._firstRound,
            round: this._round,
            isHalted: this._isHalted,
            transfers: [...this.transfers],
            deposits: [...this.deposits],
            pendingWithdrawals: [...this.pendingWithdrawals],
            confirmedWithdrawals: [...this.confirmedWithdrawals],
            admissionSigs: [...this.admissionSigs],
            admissionCountersigs: [...this.admissionCountersigs],
            proofOfLiabilities: [...this.proofOfLiabilities]
        }));
    }
    start(currentRound, firstRound) {
        if (firstRound !== undefined && firstRound > currentRound) {
            throw Error('First round cannot be > current round');
        }
        this._round = currentRound;
        this._firstRound = firstRound !== undefined ? firstRound : currentRound;
    }
    setProofOfStake(proofOfStake) {
        this.proofOfLiabilities.set(this._round, proofOfStake);
    }
    getProofOfStake(round) {
        return this.proofOfLiabilities.get(round);
    }
    deposit(amount) {
        const error = this.verifyDepositPreconditions();
        if (error) {
            throw error;
        }
        const currentDeposits = this.deposits.get(this.round);
        this.deposits.set(this.round, currentDeposits.plus(amount));
    }
    /**
     * Credits deposit to the books. Bypasses the deposit preconditions for clients
     * @param amount
     */
    creditDeposit(amount) {
        const currentDeposits = this.deposits.get(this.round);
        this.deposits.set(this.round, currentDeposits.plus(amount));
    }
    withdraw(amount) {
        let error = this.verifyWithdrawalPreconditions(amount);
        if (error) {
            throw error;
        }
        this.addPendingWithdrawal(amount);
    }
    addPendingWithdrawal(amount) {
        const currentPendingWithdrawal = this.pendingWithdrawals.get(this.round);
        this.pendingWithdrawals.set(this.round, currentPendingWithdrawal.plus(amount));
    }
    /**
     * Updates the accounting corresponding to a confirmed withdrawal:
     *  - The pending withdrawal amount is substracted for this round
     *  - The confirmed withdrawal amount is incremented for this round
     * @param amount amount of the confirmed withdrawal
     * @param round round when the withdrawal request was made (ie round <= this.round-2)
     */
    addConfirmedWithdrawal(amount, round) {
        const currentConfirmedWithdrawal = this.confirmedWithdrawals.get(this.round);
        this.confirmedWithdrawals.set(this.round, currentConfirmedWithdrawal.plus(amount));
        const pendingWithdrawalRound = this.pendingWithdrawals.get(round);
        this.pendingWithdrawals.set(round, pendingWithdrawalRound.minus(amount));
    }
    // TODO remove
    getAdmissionDigest() {
        return Bookkeeping_1.admissionDigest(this.getAdmission());
    }
    // TODO remove
    getAdmission() {
        return Bookkeeping_1.buildAdmission();
    }
    /*
     * Transfer method for trade transfers, bypassing incomingTransfers.
     * Just executes, no checks!
     */
    addInstantTransfer(transfer, round) {
        const r = round === undefined ? this._round : round;
        this.transfers.get(r).push(transfer);
        const sent = this.clientIsSender(transfer) ? transfer.amount : BigNumberUtils_1.D `0`;
        const received = this.clientIsRecipient(transfer) ? transfer.amount : BigNumberUtils_1.D `0`;
        const state = this.transacted.get(transfer.round) || {
            sold: BigNumberUtils_1.D `0`,
            bought: BigNumberUtils_1.D `0`
        };
        this.transacted.set(r, Object.assign({}, state, { sold: state.sold.plus(sent), bought: state.bought.plus(received) }));
    }
    getAdmissionCountersig(admissionDigest) {
        return this.admissionCountersigs.get(admissionDigest);
    }
    openingBalance(round) {
        const r = ramda_1.isNil(round) ? this._round : round;
        if (r < 0) {
            throw Error(`round cannot be les than zero. Given: ${r}`);
        }
        if (r === this._firstRound) {
            return BigNumberUtils_1.D `0`;
        }
        const deposits = this.getSumDepositsUntilRound(r - 1);
        const pendingWithdrawalsUntilPreviousRound = this.getSumPendingWithdrawalsUntilRound(r - 1);
        const confirmedWithdrawalsUntilPreviousRound = this.getSumConfirmedWithdrawalsUntilRound(r - 1);
        const received = this.receivedAmount(r - 1);
        const sent = this.sentAmount(r - 1);
        return deposits
            .plus(received)
            .minus(pendingWithdrawalsUntilPreviousRound)
            .minus(confirmedWithdrawalsUntilPreviousRound)
            .minus(sent);
    }
    balance(round) {
        const r = ramda_1.isNil(round) ? this._round : round;
        const deposits = this.deposits.get(r);
        const pendingWithdrawals = this.pendingWithdrawals.get(r);
        const confirmedWithdrawals = this.confirmedWithdrawals.get(r);
        const received = this.receivedAmount(r);
        const sent = this.sentAmount(r);
        return this.openingBalance(r)
            .plus(deposits)
            .plus(received)
            .minus(pendingWithdrawals)
            .minus(confirmedWithdrawals)
            .minus(sent);
    }
    getSumPendingWithdrawalsUntilRound(r) {
        let sum = BigNumberUtils_1.D `0`;
        for (let i = 0; i <= r; i++) {
            sum = sum.plus(this.pendingWithdrawals.get(i));
        }
        return sum;
    }
    getSumConfirmedWithdrawalsUntilRound(r) {
        let sum = BigNumberUtils_1.D `0`;
        for (let i = 0; i <= r; i++) {
            sum = sum.plus(this.confirmedWithdrawals.get(i));
        }
        return sum;
    }
    getSumDepositsUntilRound(r) {
        let sum = BigNumberUtils_1.D `0`;
        for (let i = 0; i <= r; i++) {
            sum = sum.plus(this.deposits.get(i));
        }
        return sum;
    }
    setAdmissionCountersig(admission, sig) {
        this.admissionCountersigs.set(admission, sig);
    }
    halt() {
        this._isHalted = true;
    }
    setAdmissionSig(admission, sig) {
        this.admissionSigs.set(admission, sig);
    }
    goToRound(newRound) {
        this._round = newRound;
    }
    goToQuarter(round, quarter) {
        if (round !== this.round) {
            throw Error('Out of sync with global timeline.');
        }
        if (!this.isFirstRound &&
            quarter == 1 &&
            !this.hasProofOfStake(this.round)) {
            throw Error(`Proof of Stake was not provided for round ${this.round}`);
        }
    }
    verifyWithdrawalPreconditions(amount, checkBalance = true
    // TODO checking balance only works once book also tracks open approvals
    //      (aka free vs locked balance)
    ) {
        const r = this.round;
        const preamble = 'Withdrawal preconditions not met';
        let error;
        const hasAlreadyWithdrawnDuringRound = this.pendingWithdrawals.get(r) > BigNumberUtils_1.D `0`;
        const canOnlyWithdrawAfterTwoRoundsFromTheStart = r < this.firstRound + 1;
        const hasNoValidProofOfStakeForPreviousRound = !this.hasProofOfStake(r - 1);
        const hasNotEnoughFundsToWithdraw = checkBalance && amount.gt(this.balance(r));
        const isHaltedMode = this._isHalted;
        if (canOnlyWithdrawAfterTwoRoundsFromTheStart) {
            error = Error(`${preamble}: Cannot withdraw before first round + 1`);
            // TODO: should this check for proof of round r instead of r - 1 now ?
        }
        else if (hasNoValidProofOfStakeForPreviousRound) {
            error = Error(`${preamble}: Proof of Stake not provided for previous round ${r - 1}`);
        }
        else if (hasNotEnoughFundsToWithdraw) {
            error = Error(`${preamble}: Insufficient balance for withdrawal`);
        }
        else if (isHaltedMode) {
            error = Error(`${preamble}: Cannot make a withdrawal when halted`);
        }
        else if (hasAlreadyWithdrawnDuringRound) {
            error = Error(`${preamble}: Cannot make a withdrawal more than once during the same round`);
        }
        else {
            error = undefined;
        }
        return error;
    }
    verifyDepositPreconditions() {
        const round = this.round;
        const preamble = 'Deposit preconditions not met';
        const hasProofOfStake = this.hasProofOfStake(round);
        const hasRatifiedAdmission = this.hasRatifiedAdmission();
        let error;
        if (this.isFirstRound && !hasRatifiedAdmission) {
            error = Error(`${preamble}: Missing ratified admission for first round`);
        }
        else if (!this.isFirstRound && !hasProofOfStake) {
            error = Error(`${preamble}: Proof of Stake not provided for round ${round}`);
        }
        else {
            error = undefined;
        }
        return error;
    }
    hasExecutableWithdrawals(round) {
        const withdrawals = this.pendingWithdrawals.get(round - 2);
        return !withdrawals.eq(BigNumberUtils_1.D('0'));
    }
    receivedAmount(round) {
        const r = ramda_1.isNil(round) ? this._round : round;
        const state = this.transacted.get(r) || {
            sold: BigNumberUtils_1.D `0`,
            bought: BigNumberUtils_1.D `0`
        };
        return state.bought;
    }
    sentAmount(round) {
        const r = ramda_1.isNil(round) ? this._round : round;
        const state = this.transacted.get(r) || {
            sold: BigNumberUtils_1.D `0`,
            bought: BigNumberUtils_1.D `0`
        };
        return state.sold;
    }
    account(round) {
        return {
            address: this.address,
            sum: this.openingBalance(round)
        };
    }
    clientIsSender(transfer) {
        return transfer.sender === this.address;
    }
    clientIsRecipient(transfer) {
        return transfer.recipient === this.address;
    }
    hasProofOfStake(round) {
        return this.proofOfLiabilities.get(round) !== undefined;
    }
    hasRatifiedAdmission() {
        const admission = this.getAdmissionDigest();
        return this.admissionCountersigs.get(admission) !== undefined;
    }
    get round() {
        return this._round;
    }
    get firstRound() {
        return this._firstRound;
    }
    get isFirstRound() {
        return this.round === this.firstRound;
    }
}
exports.ClientBookkeeping = ClientBookkeeping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50Qm9va2tlZXBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm9va2tlZXBpbmcvQ2xpZW50Qm9va2tlZXBpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsZ0VBQW9DO0FBQ3BDLGlDQUE2QjtBQWU3QixxREFBaUQ7QUFDakQsK0NBQStEO0FBQy9ELDJEQUEwQztBQUMxQyxvQ0FBd0Q7QUFFeEQsTUFBYSxpQkFBaUI7SUFrQjVCLFlBQVksT0FBZ0I7UUFoQnBCLGdCQUFXLEdBQVUsQ0FBQyxDQUFBO1FBQ3RCLFdBQU0sR0FBVSxDQUFDLENBQUE7UUFDakIsY0FBUyxHQUFZLEtBQUssQ0FBQTtRQUUxQixjQUFTLEdBQW1DLElBQUkseUJBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNyRSxhQUFRLEdBQStCLElBQUkseUJBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFBO1FBQ2xFLHVCQUFrQixHQUErQixJQUFJLHlCQUFXLENBQ3RFLEdBQUcsRUFBRSxDQUFDLGtCQUFDLENBQUEsR0FBRyxDQUNYLENBQUE7UUFDTyx5QkFBb0IsR0FBK0IsSUFBSSx5QkFBVyxDQUN4RSxHQUFHLEVBQUUsQ0FBQyxrQkFBQyxDQUFBLEdBQUcsQ0FDWCxDQUFBO1FBQ08sa0JBQWEsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNqRCx5QkFBb0IsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4RCx1QkFBa0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUM1RCxlQUFVLEdBQTJCLElBQUksR0FBRyxFQUFFLENBQUE7UUFFcEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxR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