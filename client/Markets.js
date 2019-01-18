"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Look up the base and quote symbols of a market in an Asset Registry and
 * returns the symbol for the market
 *
 * @param registry
 * @param market
 */
function marketToSymbol(registry, market) {
    const base = registry.getSymbol(market.base);
    const quote = registry.getSymbol(market.quote);
    return `${base}/${quote}`;
}
exports.marketToSymbol = marketToSymbol;
/**
 * Look up the base and quote addresses of a symbol in an Asset Registry and
 * returns the Market
 *
 * @param registry
 * @param symbol
 */
function symbolToMarket(registry, symbol) {
    const [baseSymbol, quoteSymbol] = symbol.split('/');
    const base = registry.getAddress(baseSymbol);
    const quote = registry.getAddress(quoteSymbol);
    if (base === undefined || quote === undefined) {
        throw Error(`No market for symbol '${symbol}'`);
    }
    return { base, quote };
}
exports.symbolToMarket = symbolToMarket;
function buy(market, amount, price) {
    // FIXME should use token specific precision
    const amountInBaseUnit = amount.times(1e18);
    return {
        buy: {
            asset: market.base,
            amount: amountInBaseUnit
        },
        sell: {
            asset: market.quote,
            amount: price.times(amountInBaseUnit)
        }
    };
}
exports.buy = buy;
function sell(market, amount, price) {
    // FIXME should use token specific precision
    const amountInBaseUnit = amount.times(1e18);
    return {
        buy: {
            asset: market.quote,
            amount: price.times(amountInBaseUnit)
        },
        sell: {
            asset: market.base,
            amount: amountInBaseUnit
        }
    };
}
exports.sell = sell;
exports.default = {
    toSymbol: marketToSymbol,
    fromSymbol: symbolToMarket,
    buy,
    sell
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFya2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9NYXJrZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7QUFDL0UsMENBQTBDO0FBQzFDLHVCQUF1QjtBQUN2QiwrRUFBK0U7O0FBSy9FOzs7Ozs7R0FNRztBQUNILFNBQWdCLGNBQWMsQ0FDNUIsUUFBdUIsRUFDdkIsTUFBYztJQUVkLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTlDLE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxFQUFFLENBQUE7QUFDM0IsQ0FBQztBQVJELHdDQVFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsY0FBYyxDQUM1QixRQUF1QixFQUN2QixNQUFjO0lBRWQsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRW5ELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDNUMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUU5QyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUM3QyxNQUFNLEtBQUssQ0FBQyx5QkFBeUIsTUFBTSxHQUFHLENBQUMsQ0FBQTtLQUNoRDtJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDeEIsQ0FBQztBQWRELHdDQWNDO0FBRUQsU0FBZ0IsR0FBRyxDQUNqQixNQUFjLEVBQ2QsTUFBYyxFQUNkLEtBQWE7SUFFYiw0Q0FBNEM7SUFDNUMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTNDLE9BQU87UUFDTCxHQUFHLEVBQUU7WUFDSCxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDbEIsTUFBTSxFQUFFLGdCQUFnQjtTQUN6QjtRQUNELElBQUksRUFBRTtZQUNKLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztZQUNuQixNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztTQUN0QztLQUNGLENBQUE7QUFDSCxDQUFDO0FBbEJELGtCQWtCQztBQUVELFNBQWdCLElBQUksQ0FDbEIsTUFBYyxFQUNkLE1BQWMsRUFDZCxLQUFhO0lBRWIsNENBQTRDO0lBQzVDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUUzQyxPQUFPO1FBQ0wsR0FBRyxFQUFFO1lBQ0gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBRSxnQkFBZ0I7U0FDekI7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQWxCRCxvQkFrQkM7QUFFRCxrQkFBZTtJQUNiLFFBQVEsRUFBRSxjQUFjO0lBQ3hCLFVBQVUsRUFBRSxjQUFjO0lBQzFCLEdBQUc7SUFDSCxJQUFJO0NBQ0wsQ0FBQSJ9