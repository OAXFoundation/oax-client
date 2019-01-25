import BigNumber from 'bignumber.js';
import { Account, Address, Amount, BookkeepingStateJson, Digest, Round, Quarter, ProofOfLiability, Signature, Transfer, Admission } from '../BasicTypes';
import { DefaultDict } from '../libs/Collections';
export declare class ClientBookkeeping {
    private readonly address;
    private _firstRound;
    private _round;
    private _isHalted;
    private transfers;
    private deposits;
    private pendingWithdrawals;
    private confirmedWithdrawals;
    private admissionSigs;
    private admissionCountersigs;
    private proofOfLiabilities;
    private transacted;
    constructor(address: Address);
    static fromJSON(json: BookkeepingStateJson): ClientBookkeeping;
    toJSON(): BookkeepingStateJson;
    start(currentRound: Round, firstRound?: Round): void;
    setProofOfStake(proofOfStake: ProofOfLiability): void;
    getProofOfStake(round: Round): ProofOfLiability | undefined;
    deposit(amount: Amount): void;
    /**
     * Credits deposit to the books. Bypasses the deposit preconditions for clients
     * @param amount
     */
    creditDeposit(amount: Amount): void;
    withdraw(amount: Amount): void;
    addPendingWithdrawal(amount: Amount): void;
    /**
     * Updates the accounting corresponding to a confirmed withdrawal:
     *  - The pending withdrawal amount is substracted for this round
     *  - The confirmed withdrawal amount is incremented for this round
     * @param amount amount of the confirmed withdrawal
     * @param round round when the withdrawal request was made (ie round <= this.round-2)
     */
    addConfirmedWithdrawal(amount: Amount, round: Round): void;
    getAdmissionDigest(): Digest;
    getAdmission(): Admission;
    addInstantTransfer(transfer: Transfer, round?: Round): void;
    getAdmissionCountersig(admissionDigest: Digest): string | undefined;
    openingBalance(round?: Round): Amount;
    balance(round?: Round): Amount;
    getSumUntilRound(r: Round, amountDict: DefaultDict<Round, Amount>): Amount;
    setAdmissionCountersig(admission: Digest, sig: Signature): void;
    halt(): void;
    setAdmissionSig(admission: Digest, sig: Signature): void;
    goToRound(newRound: Round): void;
    goToQuarter(round: Round, quarter: Quarter): void;
    verifyWithdrawalPreconditions(amount: Amount, checkBalance?: boolean): Error | undefined;
    verifyDepositPreconditions(): Error | undefined;
    hasExecutableWithdrawals(round: Round): boolean;
    receivedAmount(round?: Round): BigNumber;
    sentAmount(round?: Round): BigNumber;
    account(round?: Round): Account;
    private clientIsSender;
    private clientIsRecipient;
    private hasProofOfStake;
    private hasRatifiedAdmission;
    readonly round: Round;
    readonly firstRound: Round;
    readonly isFirstRound: boolean;
}
