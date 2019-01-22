import { AssetRegistry } from './AssetRegistry';
import { Amount, Lot, Market } from './BasicTypes';
/**
 * Look up the base and quote symbols of a market in an Asset Registry and
 * returns the symbol for the market
 *
 * @param registry
 * @param market
 */
export declare function marketToSymbol(registry: AssetRegistry, market: Market): string;
/**
 * Look up the base and quote addresses of a symbol in an Asset Registry and
 * returns the Market
 *
 * @param registry
 * @param symbol
 */
export declare function symbolToMarket(registry: AssetRegistry, symbol: string): Market;
export declare function buy(market: Market, amount: Amount, price: Amount): {
    buy: Lot;
    sell: Lot;
};
export declare function sell(market: Market, amount: Amount, price: Amount): {
    buy: Lot;
    sell: Lot;
};
declare const _default: {
    toSymbol: typeof marketToSymbol;
    fromSymbol: typeof symbolToMarket;
    buy: typeof buy;
    sell: typeof sell;
};
export default _default;
