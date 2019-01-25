import { TransactionReceipt } from 'ethers/providers';
import EventEmitter from 'eventemitter3';
import { Address, Amount, Quarter, Round, ProofOfLiability, AssetAddress } from './BasicTypes';
import { IMediatorAsync } from './mediator/IMediatorAsync';
import { ClientBookkeeping } from './bookkeeping/ClientBookkeeping';
import { Identity } from './identity/Identity';
import { TransportClient } from './transport/TransportClient';
import { Proof } from './SmartContractTypes';
interface ClientOptions {
    operatorAddress: Address;
    mediator: IMediatorAsync | Address;
    millisecondsBetweenPolling?: number;
}
export interface IClient {
    round: Round;
    quarter: Quarter;
    readonly address: Address;
    readonly isConnected: boolean;
    readonly transport?: TransportClient;
    join(): void;
    leave(): Promise<void>;
    deposit(asset: AssetAddress, amount: Amount, approve?: boolean): void;
    withdraw(asset: AssetAddress, amount: Amount, withBookkeeping: boolean): void;
    confirmWithdrawal(asset: AssetAddress): Promise<void>;
    on(eventName: string, callback: EventEmitter.ListenerFn): void;
    once(eventName: string, callback: EventEmitter.ListenerFn): void;
    isHalted(): Promise<boolean>;
    audit(round?: Round): Promise<void>;
    verifyProof(asset: AssetAddress, proofOfLiability: ProofOfLiability, round?: Round): void;
}
export declare class Client implements IClient {
    isPollingOperator: boolean;
    readonly address: Address;
    readonly identity: Identity;
    readonly books: Map<AssetAddress, ClientBookkeeping>;
    readonly millisecondsBetweenPolling: number;
    readonly assets: AssetAddress[];
    readonly transport: TransportClient;
    private isOperatorPollingFinished;
    private _isConnected;
    private readonly operatorAddress;
    private readonly mediator;
    private readonly eventEmitter;
    private _roundJoined;
    private _round;
    private _quarter;
    private _roundSize;
    private static mkMediatorAsync;
    constructor(assets: AssetAddress[], identity: Identity, transport: TransportClient | string, options: ClientOptions);
    readonly round: number;
    readonly quarter: Quarter;
    setState(state: {
        roundJoined: Round;
    }): void;
    /**
     * Joins layer 2 network
     *
     * @throws {SignatureError}
     */
    join(): Promise<void>;
    leave(): Promise<void>;
    deposit(asset: AssetAddress, amount: Amount, approve?: boolean): Promise<void>;
    verifyPreconditionsForBook(asset: AssetAddress): Error | undefined;
    getBook(asset: AssetAddress): ClientBookkeeping;
    isHalted(): Promise<boolean>;
    fetchProof(asset: AssetAddress, round: Round): Promise<Proof>;
    mkProof(proof: ProofOfLiability, asset: AssetAddress): Proof;
    ensureHaltedState(book: ClientBookkeeping): Promise<void>;
    withdraw(asset: AssetAddress, amount: Amount, withBookkeeping?: boolean): Promise<TransactionReceipt>;
    audit(): Promise<void>;
    auditAsset(asset: AssetAddress, round: Round): Promise<void>;
    verifyProof(asset: AssetAddress, proofOfLiability: ProofOfLiability, round?: Round): Promise<void>;
    goToRound(round: Round): void;
    ensureRound(): Promise<void>;
    ensureQuarter(): Promise<void>;
    confirmWithdrawal(asset: AssetAddress): Promise<void>;
    goToQuarter(round: Round, quarter: Quarter): Promise<void>;
    on(eventName: string, callback: EventEmitter.ListenerFn): void;
    once(eventName: string, callback: EventEmitter.ListenerFn): void;
    readonly roundJoined: Round;
    readonly isConnected: boolean;
    readonly roundSize: Amount | undefined;
    private validateCountersig;
    private registerEventListeners;
    private pollOperatorForStateChange;
}
export {};
