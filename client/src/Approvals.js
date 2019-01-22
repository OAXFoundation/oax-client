"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const ethers_1 = require("ethers");
const BigNumberUtils_1 = require("./libs/BigNumberUtils");
const Errors_1 = require("./Errors");
function hashApprovalRequestParams(params) {
    return ethers_1.ethers.utils.solidityKeccak256([
        'uint256',
        'address',
        'uint256',
        'address',
        'uint256',
        'string',
        'address',
        'uint256'
    ], [
        params.round,
        params.buy.asset,
        ethers_1.ethers.utils.bigNumberify(params.buy.amount.toString(10)),
        params.sell.asset,
        ethers_1.ethers.utils.bigNumberify(params.sell.amount.toString(10)),
        params.intent,
        params.owner,
        params.timestamp
    ]);
}
exports.hashApprovalRequestParams = hashApprovalRequestParams;
function validateApprovalAmounts(approval) {
    const buy = ramda_1.path(['params', 'buy', 'amount'], approval);
    const sell = ramda_1.path(['params', 'sell', 'amount'], approval);
    if (BigNumberUtils_1.D('0').gt(buy)) {
        throw new Errors_1.AmountError('Approval buy amount cannot be <= 0');
    }
    if (BigNumberUtils_1.D('0').gt(sell)) {
        throw new Errors_1.AmountError('Approval sell amount cannot be <= 0');
    }
}
exports.validateApprovalAmounts = validateApprovalAmounts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwcm92YWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0FwcHJvdmFscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSxpQ0FBNEI7QUFDNUIsbUNBQStCO0FBRS9CLDBEQUF5QztBQUN6QyxxQ0FBc0M7QUFFdEMsU0FBZ0IseUJBQXlCLENBQ3ZDLE1BQTZCO0lBRTdCLE9BQU8sZUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FDbkM7UUFDRSxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFFBQVE7UUFDUixTQUFTO1FBQ1QsU0FBUztLQUNWLEVBQ0Q7UUFDRSxNQUFNLENBQUMsS0FBSztRQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSztRQUNoQixlQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQ2pCLGVBQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsTUFBTTtRQUNiLE1BQU0sQ0FBQyxLQUFLO1FBQ1osTUFBTSxDQUFDLFNBQVM7S0FDakIsQ0FDRixDQUFBO0FBQ0gsQ0FBQztBQXpCRCw4REF5QkM7QUFFRCxTQUFnQix1QkFBdUIsQ0FBQyxRQUFrQjtJQUN4RCxNQUFNLEdBQUcsR0FBRyxZQUFJLENBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBRSxDQUFBO0lBQ2hFLE1BQU0sSUFBSSxHQUFHLFlBQUksQ0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFFLENBQUE7SUFFbEUsSUFBSSxrQkFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsQixNQUFNLElBQUksb0JBQVcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0tBQzVEO0lBRUQsSUFBSSxrQkFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQixNQUFNLElBQUksb0JBQVcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0tBQzdEO0FBQ0gsQ0FBQztBQVhELDBEQVdDIn0=