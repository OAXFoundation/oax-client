import BigNumber from 'bignumber.js';
import { ApprovalRequest, ApprovalRequestJson, ExchangeBalancesJson, JsonOrderBook, Order, OrderBook, OrderJson, ExchangeBalances, Transfer, TransferJson, BookkeepingStateJson, LiabilityJson, Liability, TradeExternal, TradeJson } from './BasicTypes';
import { ClientBookkeeping } from './bookkeeping/ClientBookkeeping';
export declare const OrderSerDe: {
    toJSON(order: Order): OrderJson;
    fromJSON(json: OrderJson): Order;
};
export declare const TradeSerDe: {
    toJSON(trade: TradeExternal): TradeJson;
    fromJSON(json: TradeJson): TradeExternal;
};
export declare const BalancesSerDe: {
    toJSON(balances: ExchangeBalances): ExchangeBalancesJson;
    fromJSON(json: ExchangeBalancesJson): ExchangeBalances;
};
export declare const OrderBookSerDe: {
    toJSON(orderBook: OrderBook): JsonOrderBook;
    fromJSON(json: JsonOrderBook): OrderBook;
};
export declare const ApprovalRequestSerDe: {
    toJSON(request: ApprovalRequest): ApprovalRequestJson;
    fromJSON(json: ApprovalRequestJson): ApprovalRequest;
};
export declare const ClientBookkeepingSerDe: {
    toJSON(book: ClientBookkeeping): BookkeepingStateJson;
    fromJSON(json: BookkeepingStateJson): ClientBookkeeping;
};
export declare const TransferSerDe: {
    toJSON(transfer: Transfer): TransferJson;
    fromJSON(json: TransferJson): Transfer;
};
export declare const LiabilitySerDe: {
    toJSON(liability: Liability): LiabilityJson;
    fromJSON(json: LiabilityJson): {
        sum: BigNumber;
    } & LiabilityJson;
};
