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
exports.TradeSerDe = {
    toJSON(trade) {
        const { fee } = trade;
        return Object.assign({}, trade, { price: trade.price.toString(10), amount: trade.amount.toString(10), fee: fee != undefined
                ? Object.assign({}, fee, { cost: fee.cost.toString(10) }) : undefined });
    },
    fromJSON(json) {
        const { fee } = json;
        return Object.assign({}, json, { price: BigNumberUtils_1.D(json.price), amount: BigNumberUtils_1.D(json.amount), fee: fee != undefined ? Object.assign({}, fee, { cost: BigNumberUtils_1.D(fee.cost) }) : undefined });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VyRGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU2VyRGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsaUNBQXFEO0FBQ3JELGdFQUFvQztBQW9CcEMsMERBQXlDO0FBQ3pDLHVFQUFtRTtBQUV0RCxRQUFBLFVBQVUsR0FBRztJQUN4QixNQUFNLENBQUMsS0FBWTtRQUNqQix5QkFDSyxLQUFLLElBQ1IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUMvQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQ2pDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUN4QztJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsSUFBZTtRQUN0Qix5QkFDSyxJQUFJLElBQ1AsS0FBSyxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2hDLE1BQU0sRUFBRSxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNsQyxNQUFNLEVBQUUsSUFBSSxzQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDbEMsU0FBUyxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQ3pDO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBRztJQUN4QixNQUFNLENBQUMsS0FBb0I7UUFDekIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQTtRQUNyQix5QkFDSyxLQUFLLElBQ1IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUMvQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQ2pDLEdBQUcsRUFDRCxHQUFHLElBQUksU0FBUztnQkFDZCxDQUFDLG1CQUNNLEdBQUcsSUFDTixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBRS9CLENBQUMsQ0FBQyxTQUFTLElBQ2hCO0lBQ0gsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFlO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDcEIseUJBQ0ssSUFBSSxJQUNQLEtBQUssRUFBRSxrQkFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDcEIsTUFBTSxFQUFFLGtCQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUN0QixHQUFHLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLG1CQUFNLEdBQUcsSUFBRSxJQUFJLEVBQUUsa0JBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUcsQ0FBQyxDQUFDLFNBQVMsSUFDbEU7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsYUFBYSxHQUFHO0lBQzNCLE1BQU0sQ0FBQyxRQUEwQjtRQUMvQixJQUFJLElBQUksR0FBeUIsRUFBRSxDQUFBO1FBRW5DLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDdkIsTUFBTSxJQUFJLEdBQXFDO2dCQUM3QyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUN6QixNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQzlCLENBQUE7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFBO1NBQ2pCO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQTBCO1FBQ2pDLElBQUksUUFBUSxHQUFxQixFQUFFLENBQUE7UUFFbkMsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNuQixNQUFNLElBQUksR0FBMkM7Z0JBQ25ELElBQUksRUFBRSxrQkFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsTUFBTSxFQUFFLGtCQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNwQixDQUFBO1lBRUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtTQUNyQjtRQUVELE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUM7Q0FDRixDQUFBO0FBRVksUUFBQSxjQUFjLEdBQUc7SUFDNUIsTUFBTSxDQUFDLFNBQW9CO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDaEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUNuQyxDQUFDLENBQUE7UUFFRixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN0QyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUV0Qyx5QkFBWSxTQUFTLElBQUUsSUFBSSxFQUFFLElBQUksSUFBRTtJQUNyQyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQW1CO1FBQzFCLE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxLQUFLLEVBQUUsa0JBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxrQkFBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFdkMseUJBQVksSUFBSSxJQUFFLElBQUksRUFBRSxJQUFJLElBQUU7SUFDaEMsQ0FBQztDQUNGLENBQUE7QUFFWSxRQUFBLG9CQUFvQixHQUFHO0lBQ2xDLE1BQU0sQ0FBQyxPQUF3QjtRQUM3QixPQUFPLHNCQUFjLENBQUMsT0FBTyxFQUFFO1lBQzdCLE1BQU0sRUFBRTtnQkFDTixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDdkQsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFDMUQ7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQXlCO1FBQ2hDLE9BQU8scUJBQWEsQ0FDbEI7WUFDRSxNQUFNLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEQsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTthQUN6RDtTQUNGLEVBQ0QsSUFBSSxDQUNMLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsc0JBQXNCLEdBQUc7SUFDcEMsTUFBTSxDQUFDLElBQXVCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBMEI7UUFDakMsT0FBTyxxQ0FBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNGLENBQUE7QUFFWSxRQUFBLGFBQWEsR0FBRztJQUMzQixNQUFNLENBQUMsUUFBa0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQWtCO1FBQ3pCLE9BQU8scUJBQWEsQ0FDbEI7WUFDRSxNQUFNLEVBQUUsSUFBSSxzQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDbkMsRUFDRCxJQUFJLENBQ0wsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRVksUUFBQSxjQUFjLEdBQUc7SUFDNUIsTUFBTSxDQUFDLFNBQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFtQjtRQUMxQixPQUFPLHFCQUFhLENBQ2xCO1lBQ0UsR0FBRyxFQUFFLElBQUksc0JBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQzdCLEVBQ0QsSUFBSSxDQUNMLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQSJ9