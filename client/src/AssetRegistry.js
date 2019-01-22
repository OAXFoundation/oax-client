"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
class AssetRegistry {
    constructor() {
        this.symbolAddresses = new Map();
        this.addressSymbols = new Map();
        // TODO .remove(), KYC flag
    }
    add(symbol, address) {
        const symbolError = verifySymbol(symbol);
        if (symbolError) {
            throw symbolError;
        }
        const addressError = verifyAddress(address);
        if (addressError) {
            throw addressError;
        }
        this.symbolAddresses.set(symbol, address);
        this.addressSymbols.set(address, symbol);
    }
    getAddress(name) {
        return this.symbolAddresses.get(name);
    }
    getSymbol(address) {
        return this.addressSymbols.get(address);
    }
}
exports.AssetRegistry = AssetRegistry;
function verifySymbol(symbol) {
    if (!isString(symbol) || symbol.length === 0 || !isAlphaNumeric(symbol)) {
        return Error(`'${symbol}' is not a valid symbol. Alphanumeric string expected.`);
    }
    return null;
}
exports.verifySymbol = verifySymbol;
function isString(s) {
    return typeof s === 'string';
}
function isAlphaNumeric(s) {
    return /^[0-9a-zA-Z]*$/.test(s);
}
function verifyAddress(address) {
    if (!ethereumjs_util_1.isValidAddress(address)) {
        return Error(`'${address}' is not a valid address.`);
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNzZXRSZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Bc3NldFJlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7QUFDL0UsMENBQTBDO0FBQzFDLHVCQUF1QjtBQUN2QiwrRUFBK0U7O0FBRS9FLHFEQUFnRDtBQUdoRCxNQUFhLGFBQWE7SUFBMUI7UUFDVSxvQkFBZSxHQUF5QixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2pELG1CQUFjLEdBQXlCLElBQUksR0FBRyxFQUFFLENBQUE7UUEyQnhELDJCQUEyQjtJQUM3QixDQUFDO0lBMUJDLEdBQUcsQ0FBQyxNQUFjLEVBQUUsT0FBZ0I7UUFDbEMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXhDLElBQUksV0FBVyxFQUFFO1lBQ2YsTUFBTSxXQUFXLENBQUE7U0FDbEI7UUFFRCxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFM0MsSUFBSSxZQUFZLEVBQUU7WUFDaEIsTUFBTSxZQUFZLENBQUE7U0FDbkI7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxTQUFTLENBQUMsT0FBZ0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0NBR0Y7QUE5QkQsc0NBOEJDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE1BQWM7SUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2RSxPQUFPLEtBQUssQ0FDVixJQUFJLE1BQU0sd0RBQXdELENBQ25FLENBQUE7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQVJELG9DQVFDO0FBRUQsU0FBUyxRQUFRLENBQUMsQ0FBUztJQUN6QixPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQTtBQUM5QixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsQ0FBUztJQUMvQixPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsT0FBZ0I7SUFDckMsSUFBSSxDQUFDLGdDQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDNUIsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLDJCQUEyQixDQUFDLENBQUE7S0FDckQ7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMifQ==