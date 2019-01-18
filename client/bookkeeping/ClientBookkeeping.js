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
        this.withdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`);
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
        book.withdrawals = new Collections_1.DefaultDict(() => BigNumberUtils_1.D `0`, json.withdrawals.map(([round, amount]) => [
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
            withdrawals: [...this.withdrawals],
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
        this.addWithdrawal(amount);
    }
    addWithdrawal(amount) {
        const currentWithdrawal = this.withdrawals.get(this.round);
        this.withdrawals.set(this.round, currentWithdrawal.plus(amount));
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
        const initial = this.openingBalance(r - 1);
        const deposits = this.deposits.get(r - 1);
        const withdrawals = this.withdrawals.get(r - 1);
        const received = this.receivedAmount(r - 1);
        const sent = this.sentAmount(r - 1);
        return initial
            .plus(deposits)
            .plus(received)
            .minus(withdrawals)
            .minus(sent);
    }
    balance(round) {
        const r = ramda_1.isNil(round) ? this._round : round;
        const deposits = this.deposits.get(r);
        const withdrawals = this.withdrawals.get(r);
        const received = this.receivedAmount(r);
        const sent = this.sentAmount(r);
        return this.openingBalance(r)
            .plus(deposits)
            .plus(received)
            .minus(withdrawals)
            .minus(sent);
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
        const hasAlreadyWithdrawnDuringRound = this.withdrawals.get(r) > BigNumberUtils_1.D `0`;
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
        const withdrawals = this.withdrawals.get(round - 2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50Qm9va2tlZXBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm9va2tlZXBpbmcvQ2xpZW50Qm9va2tlZXBpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsZ0VBQW9DO0FBQ3BDLGlDQUE2QjtBQWU3QixxREFBaUQ7QUFDakQsK0NBQStEO0FBQy9ELDJEQUEwQztBQUMxQyxvQ0FBd0Q7QUFFeEQsTUFBYSxpQkFBaUI7SUFhNUIsWUFBWSxPQUFnQjtRQVhwQixnQkFBVyxHQUFVLENBQUMsQ0FBQTtRQUN0QixXQUFNLEdBQVUsQ0FBQyxDQUFBO1FBQ2pCLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFFMUIsY0FBUyxHQUFtQyxJQUFJLHlCQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDckUsYUFBUSxHQUErQixJQUFJLHlCQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBQTtRQUNsRSxnQkFBVyxHQUErQixJQUFJLHlCQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBQTtRQUNyRSxrQkFBYSxHQUEyQixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2pELHlCQUFvQixHQUEyQixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ3hELHVCQUFrQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQzVELGVBQVUsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUVwRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtJQUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUEwQjtRQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtR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