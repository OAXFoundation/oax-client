import { BigNumber } from 'bignumber.js';
import { Identity } from '../identity/Identity';
import { Amount, ApprovalId, AssetAddress, Order, OrderBook, TradeExternal, ExchangeBalances } from '../BasicTypes';
import { IClient } from '../Client';
import { TransportClient } from '../transport/TransportClient';
import { AssetRegistry } from '../AssetRegistry';
declare type ClientConfig = {
    transport?: TransportClient;
};
export declare class BaseExchangeClient {
    readonly assetRegistry: AssetRegistry;
    private identity;
    private hubClient;
    private transport;
    private _isConnected;
    private config;
    constructor(identity: Identity, hubClient: IClient, assetRegistry?: AssetRegistry, config?: ClientConfig);
    /**
     * Joins an OAX hub
     *
     * Each wallet address must join the operator at least once
     *
     * @signing_required
     */
    join(): Promise<void>;
    /**
     * Leaves an OAX hub
     */
    leave(): Promise<void>;
    /**
     * Get the order book for a symbol/asset pair
     * @param symbol
     */
    fetchOrderBook(symbol: string): Promise<OrderBook>;
    /**
     * Trade history for a symbol/asset pair
     * @param symbol
     */
    fetchTrades(symbol: string): Promise<TradeExternal[]>;
    /**
     * Get all balances for each asset
     */
    fetchBalances(): Promise<ExchangeBalances>;
    /**
     * Create order
     *
     * @signature-required
     */
    createOrder(symbol: string, orderType: 'limit', side: 'buy' | 'sell', amount: Amount, price: Amount): Promise<ApprovalId>;
    /**
     * Get order details
     * @param id
     */
    fetchOrder(id: string): Promise<Order | null>;
    /**
     * Get all user orders
     */
    fetchOrders(): Promise<Order[]>;
    /**
     * Deposit asset
     *
     * @onchain
     * @signature-required
     */
    deposit(asset: AssetAddress, amount: BigNumber, approve?: boolean): Promise<void>;
    /**
     * Non-collaborative asset withdrawal request
     *
     * In case if the hub is unresponsive, the withdrawal request can be
     * submitted directly to the hub smart contract.
     *
     * A withdrawal confirmation window must pass
     * (approximately X hours currently) before the user can perform the actual
     * withdrawal by calling on-chain withdrawal.
     *
     * Note: Confirmation of withdrawal handled by hubClient on new Quarter.
     *
     * @onchain
     * @signature-required
     */
    requestWithdrawal(asset: AssetAddress, amount: BigNumber): Promise<void>;
    confirmWithdrawal(asset: AssetAddress): Promise<void>;
    readonly isConnected: boolean;
}
export {};
