import { BigNumber } from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers/utils/bignumber';
export declare type Id = string;
export declare type Digest = string;
export declare type Address = string;
export declare type Amount = BigNumber;
export declare type Signature = string;
export declare type SignatureSol = string[];
export declare type Round = number;
export declare type Counter = number;
export declare type AssetAddress = Address;
export declare type Intent = 'buyAll' | 'sellAll';
export declare type ApprovalId = Id;
export declare type FillId = Id;
export declare type TradeId = Id;
export interface NodeData {
    offset: number;
    information: string;
    openingBalance: number;
}
export declare type Leaf = NodeData;
export interface Transfer {
    round: Round;
    sender: Address;
    recipient: Address;
    amount: Amount;
    asset: AssetAddress;
}
export interface TransferJson extends Pick<Transfer, Exclude<keyof Transfer, 'amount'>> {
    amount: string;
}
export interface BookkeepingStateJson {
    address: string;
    firstRound: number;
    round: number;
    isHalted: boolean;
    transfers: [number, TransferJson[]][];
    deposits: Array<[number, string]>;
    pendingWithdrawals: Array<[number, string]>;
    confirmedWithdrawals: Array<[number, string]>;
    admissionSigs: [string, string][];
    admissionCountersigs: [string, string][];
    proofOfLiabilities: [number, LiabilityJson[]][];
}
export interface LedgerstateJson {
    clientBookkeeping: [string, BookkeepingStateJson][];
    asset: AssetAddress;
    clientIDs: [string, number][];
    commits: [number, LiabilityJson][];
    round: number;
}
export declare type SwapInstruction = [Transfer, Transfer];
export interface Admission {
    root: Digest | null;
}
export declare type Quarter = 0 | 1 | 2 | 3;
export declare type ProofOfLiability = Liability[];
export interface Transacted {
    sold: Amount;
    bought: Amount;
}
export interface Liability {
    hash: Digest;
    sum: Amount;
}
export interface LiabilityJson {
    hash: string;
    sum: string;
}
export interface Account {
    address: Address;
    sum: Amount;
}
export interface Lot {
    asset: AssetAddress;
    amount: Amount;
}
export interface LotJson {
    asset: AssetAddress;
    amount: string;
}
export interface ApprovalParams {
    approvalId: ApprovalId;
    round: Round;
    buy: Lot;
    sell: Lot;
    intent: Intent;
    owner: Address;
    timestamp: number;
}
export interface Approval {
    params: ApprovalParams;
    ownerSig: Signature;
}
export interface ApprovalRequest {
    params: {
        round: Round;
        buy: Lot;
        sell: Lot;
        intent: Intent;
        owner: Address;
        timestamp: number;
    };
    ownerSig: Signature;
}
export interface ApprovalRequestJson {
    params: {
        round: Round;
        buy: LotJson;
        sell: LotJson;
        intent: Intent;
        owner: Address;
        timestamp: number;
    };
    ownerSig: Signature;
}
export declare type ApprovalRequestParams = ApprovalRequest['params'];
export interface Amounts {
    buy: {
        amount: Amount;
    };
    sell: {
        amount: Amount;
    };
}
export interface Assets {
    buy: {
        asset: AssetAddress;
    };
    sell: {
        asset: AssetAddress;
    };
}
export declare type MatchParams = Amounts;
export interface PriorityParams extends MatchParams {
    timestamp: number;
}
export interface FilterParams extends Assets {
    owner: Address;
    round: Round;
}
export interface SwapAmounts {
    fromLeft: Amount;
    fromRight: Amount;
}
export interface TradeInternal {
    tradeId: TradeId;
    timestamp: number;
    left: {
        approvalId: ApprovalId;
        sell: Amount;
    };
    right: {
        approvalId: ApprovalId;
        sell: Amount;
    };
}
export interface FillParams extends MatchParams {
    fillId: FillId;
    approvalId: ApprovalId;
}
export interface Fill {
    params: FillParams;
    operatorSig: Signature;
}
export declare type OrderStatus = 'open' | 'closed' | 'canceled';
export declare type MarketSide = 'buy' | 'sell';
/**
 * Fields in Order that measures quantity
 */
export declare type OrderQuantityFields = Extract<keyof Order, 'price' | 'amount' | 'filled' | 'remaining'>;
export interface FeeInfo {
    cost: number;
    currency: string;
    rate?: number;
}
export interface Order {
    id: string;
    datetime: string;
    timestamp: number;
    status: OrderStatus;
    symbol: string;
    type: 'limit';
    side: MarketSide;
    price: Amount;
    amount: Amount;
    filled: Amount;
    remaining: Amount;
    trades: TradeExternal[];
    fee: FeeInfo | null;
}
export interface OrderJson extends Pick<Order, Exclude<keyof Order, 'price' | 'amount' | 'filled' | 'remaining'>> {
    price: string;
    amount: string;
    filled: string;
    remaining: string;
}
export interface TradeExternal {
    info: any;
    id: Id;
    timestamp: number;
    datetime: string;
    symbol: string;
    order: Id;
    type: 'limit';
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    cost?: number;
    fee?: FeeInfo;
}
export interface ClientState {
    openingBalance: Amount;
    proof: ProofOfLiability;
}
export declare type MarketDepthLevel = 'L1' | 'L2' | 'L3';
export declare type BidAsk = Pick<Order, 'price' | 'amount'>;
export declare type JsonBidAsk = {
    price: string;
    amount: string;
};
export interface OrderBook {
    symbol: string;
    level: MarketDepthLevel;
    bids: BidAsk[];
    asks: BidAsk[];
    timestamp: number;
    datetime: string;
}
export interface JsonOrderBook extends Pick<OrderBook, Exclude<keyof OrderBook, 'bids' | 'asks'>> {
    bids: JsonBidAsk[];
    asks: JsonBidAsk[];
}
export declare type MarketDepth = Pick<OrderBook, 'bids' | 'asks'>;
export interface Market {
    base: AssetAddress;
    quote: AssetAddress;
}
export declare type TradingPair = string;
export interface HttpTransportOptions {
    port?: number;
    host?: string;
    backlog?: number;
}
export interface TransportConfig {
    type: 'http';
    options?: HttpTransportOptions;
}
export interface ILot {
    amount: BigNumber;
    amountSign: boolean;
    tokenAddress: Address;
}
export interface ISummaryParams {
    round: Round;
    counter: Round;
    lot1: ILot;
    lot2: ILot;
}
export declare type SummaryKind = 'approval' | 'fill';
export interface ISummary {
    params: ISummaryParams;
    sig: Signature;
}
export interface Comparator<T> {
    (a: T, b: T): number;
}
export interface ExchangeBalance {
    free: Amount;
    locked: Amount;
}
export interface ExchangeBalances {
    [symbol: string]: ExchangeBalance;
}
export interface Balances {
    [symbol: string]: Amount;
}
export interface ExchangeBalancesJson {
    [symbol: string]: {
        free: string;
        locked: string;
    };
}
export declare type ContractEvent = [Round, AssetAddress, Address, EthersBigNumber];
