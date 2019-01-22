"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const ajv_1 = __importDefault(require("ajv"));
const Errors_1 = require("../Errors");
const HTTPEndpoints_1 = require("./HTTPEndpoints");
const SerDe_1 = require("../SerDe");
// @ts-ignore
const JsonSchema_1 = require("./JsonSchema");
class HTTPClient {
    constructor(url) {
        this.serverAddress = url;
    }
    async join(authorization) {
        const url = HTTPEndpoints_1.endpoints.join.toPath();
        const result = await this.postJSON(url, {
            registration: authorization
        });
        if (result.status === 200) {
            return result.json();
        }
        else if (result.status === 401) {
            return Promise.reject(new Errors_1.SignatureError(await result.text()));
        }
        else {
            throw Error(`Unexpected HTTP error: ${result.status}`);
        }
    }
    async mediator() {
        const url = HTTPEndpoints_1.endpoints.mediator.toPath();
        const result = await this.getJSON(url);
        if (result.status === 200) {
            const json = await result.json();
            return json.mediator;
        }
        else {
            throw Error(`Unexpected HTTP error: ${result.status}`);
        }
    }
    async audit(address, asset, round) {
        const path = HTTPEndpoints_1.endpoints.audit.toPath({ address, asset });
        const params = new URLSearchParams();
        if (round != undefined)
            params.append('round', round.toString());
        const url = params.toString() ? `${path}?${params.toString()}` : path;
        const result = await this.getJSON(url);
        return result.json();
    }
    async proof(address, asset) {
        const url = HTTPEndpoints_1.endpoints.proof.toPath({ address, asset });
        const result = await this.getJSON(url);
        return result.json();
    }
    async fetchOrderBook(symbol) {
        const url = HTTPEndpoints_1.endpoints.fetchOrderBook.toPath({ symbol });
        const result = await this.getJSON(url);
        const jsonOrderBook = await result.json();
        return SerDe_1.OrderBookSerDe.fromJSON(jsonOrderBook);
    }
    async fetchTrades(symbol) {
        const url = HTTPEndpoints_1.endpoints.fetchTrades.toPath({ symbol });
        const result = await this.getJSON(url);
        return result.json();
    }
    async fetchBalances(address) {
        const url = HTTPEndpoints_1.endpoints.fetchBalances.toPath({ address });
        const result = await this.getJSON(url);
        const json = await result.json();
        return SerDe_1.BalancesSerDe.fromJSON(json);
    }
    async createOrder(approvalRequest) {
        const url = HTTPEndpoints_1.endpoints.createOrder.toPath();
        const json = SerDe_1.ApprovalRequestSerDe.toJSON(approvalRequest);
        const result = await this.postJSON(url, json);
        if (result.status === 400 || result.status === 500) {
            const errorObject = await result.json();
            const ajv = new ajv_1.default();
            const isValidErrorObj = ajv.validate(JsonSchema_1.jsonErrorSchema, errorObject);
            if (!isValidErrorObj) {
                throw Error('Invalid error object received from server');
            }
            const error = errorObject.errors[0];
            if (error.title === 'SignatureError') {
                throw new Errors_1.SignatureError(error.detail);
            }
            else if (error.title === 'RoundMismatchError') {
                throw new Errors_1.RoundMismatchError(error.detail);
            }
            else if (error.title === 'ApprovalNotBackedError') {
                throw new Errors_1.ApprovalNotBackedError(error.detail);
            }
            else if (error.title === 'FeeUnpaidError') {
                throw new Errors_1.FeeUnpaidError(error.detail);
            }
            else {
                throw new Error(error.detail);
            }
        }
        return result.text();
    }
    async fetchOrder(id) {
        const url = HTTPEndpoints_1.endpoints.fetchOrder.toPath({ id });
        const result = await this.getJSON(url);
        let order = null;
        if (result.status === 200) {
            const json = await result.json();
            order = SerDe_1.OrderSerDe.fromJSON(json);
        }
        return order;
    }
    async fetchOrders(address) {
        const url = HTTPEndpoints_1.endpoints.fetchOrders.toPath({ owner: address });
        const result = await this.getJSON(url);
        let orders = [];
        if (result.status === 200) {
            const jsonOrders = await result.json();
            return jsonOrders.map(SerDe_1.OrderSerDe.fromJSON);
        }
        return orders;
    }
    async fastWithdrawal() {
        const url = HTTPEndpoints_1.endpoints.fastWithdrawal.toPath();
        const withdrawalParams = {};
        const result = await this.postJSON(url, withdrawalParams);
        return result.json();
    }
    async httpRequest(url, req) {
        const uri = new URL(url, this.serverAddress);
        return cross_fetch_1.default(uri.href, req);
    }
    async postJSON(url, body) {
        return this.httpRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }
    async getJSON(url) {
        return this.httpRequest(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
exports.HTTPClient = HTTPClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRUUENsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90cmFuc3BvcnQvSFRUUENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTtBQUMvRSw4REFBK0I7QUFDL0IsOENBQXFCO0FBWXJCLHNDQUtrQjtBQUNsQixtREFBMkM7QUFFM0Msb0NBS2lCO0FBQ2pCLGFBQWE7QUFDYiw2Q0FBOEM7QUFFOUMsTUFBYSxVQUFVO0lBR3JCLFlBQVksR0FBUTtRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQTtJQUMxQixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFxQjtRQUM5QixNQUFNLEdBQUcsR0FBRyx5QkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUVuQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ3RDLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUMsQ0FBQTtRQUVGLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7WUFDekIsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDckI7YUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1lBQ2hDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHVCQUFjLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQy9EO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQywwQkFBMEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7U0FDdkQ7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVE7UUFDWixNQUFNLEdBQUcsR0FBRyx5QkFBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FB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