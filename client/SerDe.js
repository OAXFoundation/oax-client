"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const BigNumberUtils_1 = require("./libs/BigNumberUtils");
const ClientBookkeeping_1 = require("./bookkeeping/ClientBookkeeping");
exports.OrderSerDe = {
    toJSON(order) {
        return Object.assign({}, order, { price: order.price.toString(10), amount: order.amount.toString(10), filled: order.filled.toString(10), remaining: order.remaining.toString(10) });
    },
    fromJSON(json) {
        return Object.assign({}, json, { price: new bignumber_js_1.default(json.price), amount: new bignumber_js_1.default(json.amount), filled: new bignumber_js_1.default(json.filled), remaining: new bignumber_js_1.default(json.remaining) });
    }
};
exports.BalancesSerDe = {
    toJSON(balances) {
        let json = {};
        for (let key of Object.keys(balances)) {
            const b = balances[key];
            const item = {
                free: b.free.toString(10),
                locked: b.locked.toString(10)
            };
            json[key] = item;
        }
        return json;
    },
    fromJSON(json) {
        let balances = {};
        for (let key of Object.keys(json)) {
            const b = json[key];
            const item = {
                free: BigNumberUtils_1.D(b.free),
                locked: BigNumberUtils_1.D(b.locked)
            };
            balances[key] = item;
        }
        return balances;
    }
};
exports.OrderBookSerDe = {
    toJSON(orderBook) {
        const toStr = (bidAsk) => ({
            price: bidAsk.price.toString(10),
            amount: bidAsk.amount.toString(10)
        });
        const bids = orderBook.bids.map(toStr);
        const asks = orderBook.asks.map(toStr);
        return Object.assign({}, orderBook, { bids, asks });
    },
    fromJSON(json) {
        const toBigNumber = (bidAsk) => ({
            price: BigNumberUtils_1.D(bidAsk.price),
            amount: BigNumberUtils_1.D(bidAsk.amount)
        });
        const bids = json.bids.map(toBigNumber);
        const asks = json.asks.map(toBigNumber);
        return Object.assign({}, json, { bids, asks });
    }
};
exports.ApprovalRequestSerDe = {
    toJSON(request) {
        return ramda_1.mergeDeepRight(request, {
            params: {
                buy: { amount: request.params.buy.amount.toString(10) },
                sell: { amount: request.params.sell.amount.toString(10) }
            }
        });
    },
    fromJSON(json) {
        return ramda_1.mergeDeepLeft({
            params: {
                buy: { amount: new bignumber_js_1.default(json.params.buy.amount) },
                sell: { amount: new bignumber_js_1.default(json.params.sell.amount) }
            }
        }, json);
    }
};
exports.ClientBookkeepingSerDe = {
    toJSON(book) {
        return book.toJSON();
    },
    fromJSON(json) {
        return ClientBookkeeping_1.ClientBookkeeping.fromJSON(json);
    }
};
exports.TransferSerDe = {
    toJSON(transfer) {
        return JSON.parse(JSON.stringify(transfer));
    },
    fromJSON(json) {
        return ramda_1.mergeDeepLeft({
            amount: new bignumber_js_1.default(json.amount)
        }, json);
    }
};
exports.LiabilitySerDe = {
    toJSON(liability) {
        return JSON.parse(JSON.stringify(liability));
    },
    fromJSON(json) {
        return ramda_1.mergeDeepLeft({
            sum: new bignumber_js_1.default(json.sum)
        }, json);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VyRGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU2VyRGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsaUNBQXFEO0FBQ3JELGdFQUFvQztBQWtCcEMsMERBQXlDO0FBQ3pDLHVFQUFtRTtBQUV0RCxRQUFBLFVBQVUsR0FBRztJQUN4QixNQUFNLENBQUMsS0FBWTtRQUNqQix5QkFDSyxLQUFLLElBQ1IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUMvQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQ2pDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUN4QztJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsSUFBZTtRQUN0Qix5QkFDSyxJQUFJLElBQ1AsS0FBSyxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2hDLE1BQU0sRUFBRSxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNsQyxNQUFNLEVBQUUsSUFBSSxzQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDbEMsU0FBUyxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQ3pDO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFWSxRQUFBLGFBQWEsR0FBRztJQUMzQixNQUFNLENBQUMsUUFBMEI7UUFDL0IsSUFBSSxJQUFJLEdBQXlCLEVBQUUsQ0FBQTtRQUVuQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3ZCLE1BQU0sSUFBSSxHQUFxQztnQkFDN0MsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztnQkFDekIsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUM5QixDQUFBO1lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtTQUNqQjtRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUEwQjtRQUNqQyxJQUFJLFFBQVEsR0FBcUIsRUFBRSxDQUFBO1FBRW5DLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbkIsTUFBTSxJQUFJLEdBQTJDO2dCQUNuRCxJQUFJLEVBQUUsa0JBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNmLE1BQU0sRUFBRSxrQkFBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7YUFDcEIsQ0FBQTtZQUVELFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7U0FDckI7UUFFRCxPQUFPLFFBQVEsQ0FBQTtJQUNqQixDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsY0FBYyxHQUFHO0lBQzVCLE1BQU0sQ0FBQyxTQUFvQjtRQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDbkMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEMsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFdEMseUJBQVksU0FBUyxJQUFFLElBQUksRUFBRSxJQUFJLElBQUU7SUFDckMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFtQjtRQUMxQixNQUFNLFdBQVcsR0FBRyxDQUFDLE1BQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0MsS0FBSyxFQUFFLGtCQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN0QixNQUFNLEVBQUUsa0JBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBRXZDLHlCQUFZLElBQUksSUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFFO0lBQ2hDLENBQUM7Q0FDRixDQUFBO0FBRVksUUFBQSxvQkFBb0IsR0FBRztJQUNsQyxNQUFNLENBQUMsT0FBd0I7UUFDN0IsT0FBTyxzQkFBYyxDQUFDLE9BQU8sRUFBRTtZQUM3QixNQUFNLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZELElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQzFEO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUF5QjtRQUNoQyxPQUFPLHFCQUFhLENBQ2xCO1lBQ0UsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RELElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDekQ7U0FDRixFQUNELElBQUksQ0FDTCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFWSxRQUFBLHNCQUFzQixHQUFHO0lBQ3BDLE1BQU0sQ0FBQyxJQUF1QjtRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN0QixDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQTBCO1FBQ2pDLE9BQU8scUNBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pDLENBQUM7Q0FDRixDQUFBO0FBRVksUUFBQSxhQUFhLEdBQUc7SUFDM0IsTUFBTSxDQUFDLFFBQWtCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDN0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFrQjtRQUN6QixPQUFPLHFCQUFhLENBQ2xCO1lBQ0UsTUFBTSxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ25DLEVBQ0QsSUFBSSxDQUNMLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsY0FBYyxHQUFHO0lBQzVCLE1BQU0sQ0FBQyxTQUFvQjtRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBbUI7UUFDMUIsT0FBTyxxQkFBYSxDQUNsQjtZQUNFLEdBQUcsRUFBRSxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUM3QixFQUNELElBQUksQ0FDTCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUEifQ==