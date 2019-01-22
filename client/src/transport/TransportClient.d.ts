import { Address, ClientState, Round, AssetAddress, OrderBook, ApprovalId, Order, TradeExternal, ApprovalRequest, ExchangeBalances } from '../BasicTypes';
export interface JoinResponse {
    acknowledgement: string;
}
export interface TransportClient {
    join(authorization: string): Promise<JoinResponse>;
    mediator(): Promise<Address>;
    audit(address: Address, asset: AssetAddress, round?: Round): Promise<ClientState>;
    proof(walletAddress: Address, asset: AssetAddress): Promise<any>;
    fetchOrderBook(symbol: string): Promise<OrderBook>;
    fetchTrades(symbol: string): Promise<TradeExternal[]>;
    fetchBalances(address: Address): Promise<ExchangeBalances>;
    createOrder(approvalRequest: ApprovalRequest): Promise<any>;
    fetchOrder(id: ApprovalId): Promise<Order | null>;
    fetchOrders(address: Address): Promise<Order[]>;
    fastWithdrawal(): Promise<any>;
    mediator(): Promise<Address>;
}
