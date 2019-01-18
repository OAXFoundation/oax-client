"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const AssetRegistry_1 = require("../AssetRegistry");
const Markets_1 = __importStar(require("../Markets"));
const Approvals_1 = require("../Approvals");
const BigNumberUtils_1 = require("../libs/BigNumberUtils");
class BaseExchangeClient {
    constructor(identity, hubClient, assetRegistry, config) {
        this._isConnected = false;
        this.hubClient = hubClient;
        this.identity = identity; // || hubClient.identity
        this.transport =
            config && config.transport ? config.transport : hubClient.transport;
        this.assetRegistry = assetRegistry || new AssetRegistry_1.AssetRegistry();
        this.config = config || {};
    }
    /**
     * Joins an OAX hub
     *
     * Each wallet address must join the operator at least once
     *
     * @signing_required
     */
    async join() {
        await this.hubClient.join();
        this._isConnected = true;
    }
    /**
     * Leaves an OAX hub
     */
    async leave() {
        return this.hubClient.leave();
    }
    /**
     * Get the order book for a symbol/asset pair
     * @param symbol
     */
    async fetchOrderBook(symbol) {
        const orderBookInWei = await this.transport.fetchOrderBook(symbol);
        const bidAskInEther = (bidAsk) => ({
            price: bidAsk.price,
            amount: BigNumberUtils_1.weiToEther(bidAsk.amount)
        });
        return ramda_1.default.mergeDeepLeft({
            asks: orderBookInWei.asks.map(bidAskInEther),
            bids: orderBookInWei.bids.map(bidAskInEther)
        }, orderBookInWei);
    }
    /**
     * Trade history for a symbol/asset pair
     * @param symbol
     */
    fetchTrades(symbol) {
        return this.transport.fetchTrades(symbol);
    }
    /**
     * Get all balances for each asset
     */
    async fetchBalances() {
        const address = this.identity.address;
        const balances = await this.transport.fetchBalances(address);
        const balancesInWei = ramda_1.default.mapObjIndexed(({ free, locked }) => ({
            free: BigNumberUtils_1.weiToEther(free),
            locked: BigNumberUtils_1.weiToEther(locked)
        }), balances);
        let balancesInSymbol = {};
        for (let asset of Object.keys(balancesInWei)) {
            const symbol = this.assetRegistry.getSymbol(asset);
            balancesInSymbol[symbol || asset] = balancesInWei[asset];
        }
        return balancesInSymbol;
    }
    /**
     * Create order
     *
     * @signature-required
     */
    async createOrder(symbol, orderType, side, amount, price) {
        if (orderType !== 'limit') {
            throw Error('Only limit order is supported at this time');
        }
        if (BigNumberUtils_1.D('0').gt(price)) {
            throw Error(`Order price must be larger than 0. price=${price}`);
        }
        if (BigNumberUtils_1.D('0').gt(amount)) {
            throw Error(`Order amount must be larger than 0. price=${amount}`);
        }
        const market = Markets_1.symbolToMarket(this.assetRegistry, symbol);
        const { buy, sell } = Markets_1.default[side](market, amount, price);
        const orderParams = {
            round: this.hubClient.round,
            buy,
            sell,
            intent: side === 'buy' ? 'buyAll' : 'sellAll',
            owner: this.identity.address,
            timestamp: Date.now()
        };
        const approvalRequestHash = Approvals_1.hashApprovalRequestParams(orderParams);
        const ownerSig = await this.identity.hashAndSign(approvalRequestHash);
        const approvalRequest = { params: orderParams, ownerSig };
        return this.transport.createOrder(approvalRequest);
    }
    /**
     * Get order details
     * @param id
     */
    fetchOrder(id) {
        return this.transport.fetchOrder(id);
    }
    /**
     * Get all user orders
     */
    async fetchOrders() {
        const address = this.identity.address;
        return this.transport.fetchOrders(address);
    }
    /**
     * Deposit asset
     *
     * @onchain
     * @signature-required
     */
    async deposit(asset, amount, approve) {
        const amountWei = BigNumberUtils_1.etherToWei(amount);
        await this.hubClient.deposit(asset, amountWei, approve);
    }
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
    async requestWithdrawal(asset, amount) {
        const symbol = this.assetRegistry.getSymbol(asset);
        const balances = (await this.fetchBalances())[symbol];
        const { free } = balances;
        if (amount.gt(free)) {
            throw Error(`Withdrawal amount ${amount} > free amount ${free}`);
        }
        const amountWei = BigNumberUtils_1.etherToD(amount.toString(10));
        const withBookkeeping = false;
        await this.hubClient.withdraw(asset, amountWei, withBookkeeping);
    }
    async confirmWithdrawal(asset) {
        return await this.hubClient.confirmWithdrawal(asset);
    }
    get isConnected() {
        return this._isConnected;
    }
}
exports.BaseExchangeClient = BaseExchangeClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUV4Y2hhbmdlQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2V4Y2hhbmdlL0Jhc2VFeGNoYW5nZUNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOzs7Ozs7Ozs7Ozs7QUFFL0Usa0RBQXFCO0FBZ0JyQixvREFBZ0Q7QUFDaEQsc0RBQW9EO0FBQ3BELDRDQUF3RDtBQUN4RCwyREFBNEU7QUFPNUUsTUFBYSxrQkFBa0I7SUFXN0IsWUFDRSxRQUFrQixFQUNsQixTQUFrQixFQUNsQixhQUE2QixFQUM3QixNQUFxQjtRQVRmLGlCQUFZLEdBQVksS0FBSyxDQUFBO1FBV25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBLENBQUMsd0JBQXdCO1FBQ2pELElBQUksQ0FBQyxTQUFTO1lBQ1osTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFVLENBQUE7UUFDdEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLElBQUksSUFBSSw2QkFBYSxFQUFFLENBQUE7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFBO0lBQzVCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUUzQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUMvQixDQUFDO0lB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