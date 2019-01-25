import { BigNumber } from 'bignumber.js';
import { Account, Address, Amount, Digest, Round, Counter, ISummaryParams, ILot, ISummary, ProofOfLiability, AssetAddress } from './BasicTypes';
export interface ProofSol {
    clientOpeningBalance: string;
    clientAddress: Address;
    hashes: Digest[];
    sums: string[];
    tokenAddress: Address;
}
export interface ProofVectorSol {
    proof1: ProofSol;
    proof2: ProofSol;
}
export declare class Proof {
    clientOpeningBalance: Amount;
    clientAddress: Address;
    hashes: Digest[];
    sums: Amount[];
    tokenAddress: Address;
    constructor(clientOpeningBalance: Amount, clientAddress: Address, hashes: Digest[], sums: Amount[], tokenAddress: Address);
    toSol(): ProofSol;
    static fromProofOfLiability(proof: ProofOfLiability, leaf: Account, asset: AssetAddress): Proof;
}
export interface ProofVector {
    proof1: Proof;
    proof2: Proof;
}
export declare class ProofVector {
    proof1: Proof;
    proof2: Proof;
    constructor(proof1: Proof, proof2: Proof);
    toSol(): ProofVectorSol;
}
export interface SummaryParamsSol {
    round: string;
    counter: string;
    lot1: LotSol;
    lot2: LotSol;
}
export interface LotSol {
    amountSign: boolean;
    amount: string;
    tokenAddress: Address;
}
export declare class Lot implements ILot {
    amountSign: boolean;
    amount: BigNumber;
    tokenAddress: Address;
    constructor(amountSign: boolean, amount: BigNumber, tokenAddress: Address);
    toSol(): LotSol;
}
export declare class SummaryParams implements ISummaryParams {
    round: Round;
    counter: Counter;
    lot1: Lot;
    lot2: Lot;
    constructor(round: Round, counter: Counter, lot1: Lot, lot2: Lot);
    toSol(): SummaryParamsSol;
}
export interface Dispute {
    openingBalance: Amount;
    round: Round;
    summary: ISummary;
    open: boolean;
}
