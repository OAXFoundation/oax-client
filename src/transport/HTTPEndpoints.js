"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
const path_to_regexp_1 = __importDefault(require("path-to-regexp"));
exports.endpoints = {
    // OPERATOR ENDPOINTS
    mediator: makeEndpoint('/mediator'),
    join: makeEndpoint('/join'),
    audit: makeEndpoint('/audit/:address/:asset', params => {
        if (params === undefined) {
            throw Error('Parameters expected for endpoint /audit');
        }
        const { address, asset } = params;
        const path = toPath('/audit/:address/:asset')({ address, asset });
        return params.round ? `${path}?round=${params.round}` : path;
    }),
    proof: makeEndpoint('/proof/:address/:asset'),
    // EXCHANGE ENDPOINTS
    fetchOrderBook: makeEndpoint('/orderbook/:symbol'),
    fetchTrades: makeEndpoint('/trades/:symbol'),
    fetchBalances: makeEndpoint('/accounts/:address/balance'),
    createOrder: makeEndpoint('/orders'),
    fetchOrder: makeEndpoint('/orders/:id'),
    fetchOrders: makeEndpoint('/orders', params => {
        if (params === undefined || params.owner === undefined) {
            throw Error('fetchOrders endpoint expects owner parameter');
        }
        return `/orders?owner=${params.owner}`;
    }),
    fastWithdrawal: makeEndpoint('/account/withdraw')
};
function makeEndpoint(path, pathBuilder) {
    let builder;
    if (pathBuilder === undefined) {
        builder = (params) => {
            return toPath(path)(params);
        };
    }
    else {
        builder = pathBuilder;
    }
    return {
        path,
        toPath: builder
    };
}
function toPath(path) {
    return path_to_regexp_1.default.compile(path);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRUUEVuZHBvaW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90cmFuc3BvcnQvSFRUUEVuZHBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTtBQUMvRSxvRUFBeUM7QUFJNUIsUUFBQSxTQUFTLEdBQUc7SUFDdkIscUJBQXFCO0lBQ3JCLFFBQVEsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDO0lBRW5DLElBQUksRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDO0lBRTNCLEtBQUssRUFBRSxZQUFZLENBQ2pCLHdCQUF3QixFQUN4QixNQUFNLENBQUMsRUFBRTtRQUNQLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO1NBQ3ZEO1FBQ0QsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUE7UUFDakMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUNqRSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxVQUFVLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBQzlELENBQUMsQ0FDRjtJQUVELEtBQUssRUFBRSxZQUFZLENBQ2pCLHdCQUF3QixDQUN6QjtJQUVELHFCQUFxQjtJQUVyQixjQUFjLEVBQUUsWUFBWSxDQUFxQixvQkFBb0IsQ0FBQztJQUN0RSxXQUFXLEVBQUUsWUFBWSxDQUFxQixpQkFBaUIsQ0FBQztJQUNoRSxhQUFhLEVBQUUsWUFBWSxDQUN6Qiw0QkFBNEIsQ0FDN0I7SUFFRCxXQUFXLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQztJQUNwQyxVQUFVLEVBQUUsWUFBWSxDQUFxQixhQUFhLENBQUM7SUFDM0QsV0FBVyxFQUFFLFlBQVksQ0FBcUIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ2hFLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN0RCxNQUFNLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFBO1NBQzVEO1FBQ0QsT0FBTyxpQkFBaUIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3hDLENBQUMsQ0FBQztJQUVGLGNBQWMsRUFBRSxZQUFZLENBQUMsbUJBQW1CLENBQUM7Q0FDbEQsQ0FBQTtBQUVELFNBQVMsWUFBWSxDQUNuQixJQUFZLEVBQ1osV0FBNEI7SUFFNUIsSUFBSSxPQUFPLENBQUE7SUFFWCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7UUFDN0IsT0FBTyxHQUFHLENBQUMsTUFBVSxFQUFFLEVBQUU7WUFDdkIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0IsQ0FBQyxDQUFBO0tBQ0Y7U0FBTTtRQUNMLE9BQU8sR0FBRyxXQUFXLENBQUE7S0FDdEI7SUFFRCxPQUFPO1FBQ0wsSUFBSTtRQUNKLE1BQU0sRUFBRSxPQUFPO0tBQ2hCLENBQUE7QUFDSCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsSUFBWTtJQUMxQixPQUFPLHdCQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25DLENBQUMifQ==