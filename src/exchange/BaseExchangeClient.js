"use strict";
/// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
    async fetchTrades(symbol) {
        const trades = await this.transport.fetchTrades(symbol);
        const amountInEther = trades.map((_a) => {
            var { amount, fee } = _a, rest = __rest(_a, ["amount", "fee"]);
            return (Object.assign({ amount: BigNumberUtils_1.weiToEther(amount), fee: fee != undefined
                    ? {
                        cost: BigNumberUtils_1.weiToEther(fee.cost),
                        currency: fee.currency
                    }
                    : undefined }, rest));
        });
        return amountInEther;
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
    async fetchOrder(id) {
        const order = await this.transport.fetchOrder(id);
        if (order == null) {
            return null;
        }
        return orderEtherToWei(order);
    }
    /**
     * Get all user orders
     */
    async fetchOrders() {
        const address = this.identity.address;
        const orders = await this.transport.fetchOrders(address);
        return orders.map(orderEtherToWei);
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
function orderEtherToWei(order) {
    const { amount, filled, remaining } = order;
    return Object.assign({}, order, { amount: BigNumberUtils_1.weiToEther(amount), filled: BigNumberUtils_1.weiToEther(filled), remaining: BigNumberUtils_1.weiToEther(remaining) });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUV4Y2hhbmdlQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2V4Y2hhbmdlL0Jhc2VFeGNoYW5nZUNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0ZBQWdGO0FBQ2hGLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFL0Usa0RBQXFCO0FBZ0JyQixvREFBZ0Q7QUFDaEQsc0RBQW9EO0FBQ3BELDRDQUF3RDtBQUN4RCwyREFBNEU7QUFPNUUsTUFBYSxrQkFBa0I7SUFXN0IsWUFDRSxRQUFrQixFQUNsQixTQUFrQixFQUNsQixhQUE2QixFQUM3QixNQUFxQjtRQVRmLGlCQUFZLEdBQVksS0FBSyxDQUFBO1FBV25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBLENBQUMsd0JBQXdCO1FBQ2pELElBQUksQ0FBQyxTQUFTO1lBQ1osTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFVLENBQUE7UUFDdEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLElBQUksSUFBSSw2QkFBYSxFQUFFLENBQUE7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFBO0lBQzVCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUUzQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUMv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