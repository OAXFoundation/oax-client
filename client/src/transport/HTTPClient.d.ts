import { Address, ClientState, Round, AssetAddress, OrderBook, ApprovalId, Order, TradeExternal, ApprovalRequest } from '../BasicTypes';
import { TransportClient } from './TransportClient';
export declare class HTTPClient implements TransportClient {
    readonly serverAddress: URL;
    constructor(url: URL);
    join(authorization: string): Promise<any>;
    mediator(): Promise<Address>;
    audit(address: Address, asset: AssetAddress, round?: Round): Promise<ClientState>;
    proof(address: Address, asset: AssetAddress): Promise<any>;
    fetchOrderBook(symbol: string): Promise<OrderBook>;
    fetchTrades(symbol: string): Promise<TradeExternal[]>;
    fetchBalances(address: Address): Promise<any>;
    createOrder(approvalRequest: ApprovalRequest): Promise<ApprovalId>;
    fetchOrder(id: ApprovalId): Promise<Order | null>;
    fetchOrders(address: Address): Promise<Order[]>;
    fastWithdrawal(): Promise<any>;
    private httpRequest;
    private postJSON;
    private getJSON;
}
