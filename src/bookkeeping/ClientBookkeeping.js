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
            throw Error(`round cannot be less than zero. Given: ${r}`);
        }
        if (r === this._firstRound) {
            return BigNumberUtils_1.D `0`;
        }
        const depositsUntilPreviousRound = this.getSumUntilRound(r - 1, this.deposits);
        const pendingWithdrawalsUntilPreviousRound = this.getSumUntilRound(r - 1, this.pendingWithdrawals);
        const confirmedWithdrawalsUntilPreviousRound = this.getSumUntilRound(r - 1, this.confirmedWithdrawals);
        const received = this.receivedAmount(r - 1);
        const sent = this.sentAmount(r - 1);
        return depositsUntilPreviousRound
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
    getSumUntilRound(r, amountDict) {
        let sum = BigNumberUtils_1.D `0`;
        for (let i = 0; i <= r; i++) {
            sum = sum.plus(amountDict.get(i));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50Qm9va2tlZXBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm9va2tlZXBpbmcvQ2xpZW50Qm9va2tlZXBpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsZ0VBQW9DO0FBQ3BDLGlDQUE2QjtBQWU3QixxREFBaUQ7QUFDakQsK0NBQStEO0FBQy9ELDJEQUEwQztBQUMxQyxvQ0FBd0Q7QUFFeEQsTUFBYSxpQkFBaUI7SUFrQjVCLFlBQVksT0FBZ0I7UUFoQnBCLGdCQUFXLEdBQVUsQ0FBQyxDQUFBO1FBQ3RCLFdBQU0sR0FBVSxDQUFDLENBQUE7UUFDakIsY0FBUyxHQUFZLEtBQUssQ0FBQTtRQUUxQixjQUFTLEdBQW1DLElBQUkseUJBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNyRSxhQUFRLEdBQStCLElBQUkseUJBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFBO1FBQ2xFLHVCQUFrQixHQUErQixJQUFJLHlCQUFXLENBQ3RFLEdBQUcsRUFBRSxDQUFDLGtCQUFDLENBQUEsR0FBRyxDQUNYLENBQUE7UUFDTyx5QkFBb0IsR0FBK0IsSUFBSSx5QkFBVyxDQUN4RSxHQUFHLEVBQUUsQ0FBQyxrQkFBQyxDQUFBLEdBQUcsQ0FDWCxDQUFBO1FBQ08sa0JBQWEsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNqRCx5QkFBb0IsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4RCx1QkFBa0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUM1RCxlQUFVLEdBQTJCLElBQUksR0FBRyxFQUFFLENBQUE7UUFFcEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBMEI7UUFDeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFBO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFFOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHlCQUFXLENBQzdCLEdBQUcsRUFBRSxDQUFDLGtCQUFDLENBQUEsR0FBRyxFQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFrQixDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0RCxLQUFLO1lBQ0wsSUFBSSxzQkFBUyxDQUFDLE1BQU0sQ0FBQztTQUN0QixDQUFDLENBQ0gsQ0FBQTtRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHlCQUFXLENBQ3ZDLEdBQUcsRUFBRSxDQUFDLGtCQUFDLENBQUEsR0FBRyxFQUNWLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hFLEtBQUs7WUFDTCxJQUFJLHNCQUFTLENBQUMsTUFBTSxDQUFDO1NBQ3RCLENBQUMsQ0FDSCxDQUFBO1FBRUQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUkseUJBQVcsQ0FDekMsR0FBRyxFQUFFLENBQUMsa0JBQUMsQ0FBQSxHQUFHLEVBQ1YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEUsS0FBSztZQUNMLElBQUksc0JBQVMsQ0FBQyxNQUFNLENBQUM7U0FDdEIsQ0FBQyxDQUNILENBQUE7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFFOUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksR0FBRyxDQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUN6QixDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN4QixLQUFLO1lBQ0wsV0FBVyxDQUFDLEdBQUcsQ0FBQyxzQkFBYyxDQUFDLFFBQVEsQ0FBQztTQUN6QyxDQUNGLENBQ0YsQ0FBQTtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRTtZQUNoRCxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLHFCQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDM0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FDZixJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM1QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUM5QixRQUFRLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDNUIsa0JBQWtCLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUNoRCxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1lBQ3BELGFBQWEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUN0QyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1lBQ3BELGtCQUFrQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7U0FDakQsQ0FBQyxDQUNILENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQW1CLEVBQUUsVUFBa0I7UUFDM0MsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsR0FBRyxZQUFZLEVBQUU7WUFDekQsTUFBTSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtTQUNyRDtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFBO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUE7SUFDekUsQ0FBQztJQUVELGVBQWUsQ0FBQyxZQUE4QjtRQUM1QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFZO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWM7UUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUE7UUFFL0MsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLEtBQUssQ0FBQTtTQUNaO1FBRUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQzdELENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsTUFBYztRQUMxQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFjO1FBQ3JCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV0RCxJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sS0FBSyxDQUFBO1NBQ1o7UUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELG9CQUFvQixDQUFDLE1BQWM7UUFDakMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUN6QixJQUFJLENBQUMsS0FBSyxFQUNWLHdCQUF3QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDdEMsQ0FBQTtJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxzQkFBc0IsQ0FBQyxNQUFjLEVBQUUsS0FBWTtRQUNqRCxNQUFNLDBCQUEwQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQzNCLElBQUksQ0FBQyxLQUFLLEVBQ1YsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUN4QyxDQUFBO1FBRUQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQzFFLENBQUM7SUFFRCxjQUFjO0lBQ2Qsa0JBQWtCO1FBQ2hCLE9BQU8sNkJBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsY0FBYztJQUNkLFlBQVk7UUFDVixPQUFPLDRCQUFjLEVBQUUsQ0FBQTtJQUN6QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsa0JBQWtCLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ2xELE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQUMsQ0FBQSxHQUFHLENBQUE7UUFDbkUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBQyxDQUFBLEdBQUcsQ0FBQTtRQUMxRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUk7WUFDbkQsSUFBSSxFQUFFLGtCQUFDLENBQUEsR0FBRztZQUNWLE1BQU0sRUFBRSxrQkFBQyxDQUFBLEdBQUc7U0FDYixDQUFBO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFDaEIsS0FBSyxJQUNSLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDM0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUNuQyxDQUFBO0lBQ0osQ0FBQztJQUVELHNCQUFzQixDQUFDLGVBQXVCO1FBQzVDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQWE7UUFDMUIsTUFBTSxDQUFDLEdBQUcsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFFNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1QsTUFBTSxLQUFLLENBQUMsMENBQTBDLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDM0Q7UUFFRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzFCLE9BQU8sa0JBQUMsQ0FBQSxHQUFHLENBQUE7U0FDWjtRQUVELE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUN0RCxDQUFDLEdBQUcsQ0FBQyxFQUNMLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQTtRQUNELE1BQU0sb0NBQW9DLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUNoRSxDQUFDLEdBQUcsQ0FBQyxFQUNMLElBQUksQ0FBQyxrQkFBa0IsQ0FDeEIsQ0FBQTtRQUNELE1BQU0sc0NBQXNDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUNsRSxDQUFDLEdBQUcsQ0FBQyxFQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FDMUIsQ0FBQTtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBRW5DLE9BQU8sMEJBQTBCO2FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDZCxLQUFLLENBQUMsb0NBQW9DLENBQUM7YUFDM0MsS0FBSyxDQUFDLHNDQUFzQyxDQUFDO2FBQzdDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQixDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQWE7UUFDbkIsTUFBTSxDQUFDLEdBQUcsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFFNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFL0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzthQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUNkLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQzthQUN6QixLQUFLLENBQUMsb0JBQW9CLENBQUM7YUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxDQUFRLEVBQUUsVUFBc0M7UUFDL0QsSUFBSSxHQUFHLEdBQVcsa0JBQUMsQ0FBQSxHQUFHLENBQUE7UUFFdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDbEM7UUFFRCxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxTQUFpQixFQUFFLEdBQWM7UUFDdEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtJQUN2QixDQUFDO0lBRUQsZUFBZSxDQUFDLFNBQWlCLEVBQUUsR0FBYztRQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFlO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO0lBQ3hCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBWSxFQUFFLE9BQWdCO1FBQ3hDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDeEIsTUFBTSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtTQUNqRDtRQUVELElBQ0UsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNsQixPQUFPLElBQUksQ0FBQztZQUNaLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2pDO1lBQ0EsTUFBTSxLQUFLLENBQUMsNkNBQTZDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELDZCQUE2QixDQUMzQixNQUFjLEVBQ2QsZUFBd0IsSUFBSTtJQUM1Qix3RUFBd0U7SUFDeEUsb0NBQW9DOztRQUVwQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLGtDQUFrQyxDQUFBO1FBRW5ELElBQUksS0FBSyxDQUFBO1FBRVQsTUFBTSw4QkFBOEIsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFDLENBQUEsR0FBRyxDQUFBO1FBQzVFLE1BQU0seUNBQXlDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sc0NBQXNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzRSxNQUFNLDJCQUEyQixHQUMvQixZQUFZLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQTtRQUVuQyxJQUFJLHlDQUF5QyxFQUFFO1lBQzdDLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLDBDQUEwQyxDQUFDLENBQUE7WUFDcEUsc0VBQXNFO1NBQ3ZFO2FBQU0sSUFBSSxzQ0FBc0MsRUFBRTtZQUNqRCxLQUFLLEdBQUcsS0FBSyxDQUNYLEdBQUcsUUFBUSxvREFBb0QsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUN2RSxDQUFBO1NBQ0Y7YUFBTSxJQUFJLDJCQUEyQixFQUFFO1lBQ3RDLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLHVDQUF1QyxDQUFDLENBQUE7U0FDbEU7YUFBTSxJQUFJLFlBQVksRUFBRTtZQUN2QixLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsUUFBUSx3Q0FBd0MsQ0FBQyxDQUFBO1NBQ25FO2FBQU0sSUFBSSw4QkFBOEIsRUFBRTtZQUN6QyxLQUFLLEdBQUcsS0FBSyxDQUNYLEdBQUcsUUFBUSxpRUFBaUUsQ0FDN0UsQ0FBQTtTQUNGO2FBQU07WUFDTCxLQUFLLEdBQUcsU0FBUyxDQUFBO1NBQ2xCO1FBRUQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsMEJBQTBCO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDeEIsTUFBTSxRQUFRLEdBQUcsK0JBQStCLENBQUE7UUFDaEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuRCxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBRXhELElBQUksS0FBSyxDQUFBO1FBQ1QsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLFFBQVEsOENBQThDLENBQUMsQ0FBQTtTQUN6RTthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ2pELEtBQUssR0FBRyxLQUFLLENBQ1gsR0FBRyxRQUFRLDJDQUEyQyxLQUFLLEVBQUUsQ0FDOUQsQ0FBQTtTQUNGO2FBQU07WUFDTCxLQUFLLEdBQUcsU0FBUyxDQUFBO1NBQ2xCO1FBRUQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsd0JBQXdCLENBQUMsS0FBWTtRQUNuQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMxRCxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxrQkFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFhO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLGFBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ3RDLElBQUksRUFBRSxrQkFBQyxDQUFBLEdBQUc7WUFDVixNQUFNLEVBQUUsa0JBQUMsQ0FBQSxHQUFHO1NBQ2IsQ0FBQTtRQUNELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQTtJQUNyQixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDdEIsTUFBTSxDQUFDLEdBQUcsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDdEMsSUFBSSxFQUFFLGtCQUFDLENBQUEsR0FBRztZQUNWLE1BQU0sRUFBRSxrQkFBQyxDQUFBLEdBQUc7U0FDYixDQUFBO1FBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFBO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBYTtRQUNuQixPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLEdBQUcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztTQUNoQyxDQUFBO0lBQ0gsQ0FBQztJQUVPLGNBQWMsQ0FBQyxRQUFrQjtRQUN2QyxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN6QyxDQUFDO0lBRU8saUJBQWlCLENBQUMsUUFBa0I7UUFDMUMsT0FBTyxRQUFRLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDNUMsQ0FBQztJQUVPLGVBQWUsQ0FBQyxLQUFZO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLENBQUE7SUFDekQsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTtRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxDQUFBO0lBQy9ELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDcEIsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtJQUN6QixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUE7SUFDdkMsQ0FBQztDQUNGO0FBelpELDhDQXlaQyJ9