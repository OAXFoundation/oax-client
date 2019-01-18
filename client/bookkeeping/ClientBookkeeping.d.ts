import BigNumber from 'bignumber.js';
import { Account, Address, Amount, BookkeepingStateJson, Digest, Round, Quarter, ProofOfLiability, Signature, Transfer, Admission } from '../BasicTypes';
export declare class ClientBookkeeping {
    private readonly address;
    private _firstRound;
    private _round;
    private _isHalted;
    private transfers;
    private deposits;
    private withdrawals;
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
    addWithdrawal(amount: Amount): void;
    getAdmissionDigest(): Digest;
    getAdmission(): Admission;
    addInstantTransfer(transfer: Transfer, round?: Round): void;
    getAdmissionCountersig(admissionDigest: Digest): string | undefined;
    openingBalance(round?: Round): Amount;
    balance(round?: Round): Amount;
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
