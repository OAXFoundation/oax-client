"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/utils");
const bignumber_1 = require("ethers/utils/bignumber");
const ramda_1 = require("ramda");
const bignumber_js_1 = require("bignumber.js");
function D(bnStr) {
    return new bignumber_js_1.BigNumber(bnStr);
}
exports.D = D;
function toEthersBn(n) {
    // Cannot go directly from BigNumber to EthersBigNumber
    const bnStr = typeof n == 'string' ? n.toString() : n.toString(10);
    return new bignumber_1.BigNumber(bnStr);
}
exports.toEthersBn = toEthersBn;
function sum(bigNums) {
    if (bigNums.length === 0) {
        return D `0`;
    }
    return bigNums.reduce((sum, val) => sum.plus(val));
}
exports.sum = sum;
exports.add = ramda_1.curry((a, b) => a.plus(b));
function etherToD(etherString) {
    return new bignumber_js_1.BigNumber(utils_1.parseEther(etherString).toString());
}
exports.etherToD = etherToD;
function etherToWei(amount) {
    return etherToD(amount.toString(10));
}
exports.etherToWei = etherToWei;
function weiToEther(amount) {
    return amount.div(D('1e18'));
}
exports.weiToEther = weiToEther;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmlnTnVtYmVyVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9CaWdOdW1iZXJVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSx3Q0FBeUM7QUFDekMsc0RBQXFFO0FBQ3JFLGlDQUE2QjtBQUM3QiwrQ0FBd0M7QUFHeEMsU0FBZ0IsQ0FBQyxDQUNmLEtBQWtFO0lBRWxFLE9BQU8sSUFBSSx3QkFBUyxDQUFDLEtBQWUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUM7QUFKRCxjQUlDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLENBQXFCO0lBQzlDLHVEQUF1RDtJQUN2RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNsRSxPQUFPLElBQUkscUJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNuQyxDQUFDO0FBSkQsZ0NBSUM7QUFFRCxTQUFnQixHQUFHLENBQUMsT0FBb0I7SUFDdEMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLENBQUMsQ0FBQSxHQUFHLENBQUE7S0FDWjtJQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNwRCxDQUFDO0FBTkQsa0JBTUM7QUFFWSxRQUFBLEdBQUcsR0FBRyxhQUFLLENBQWtDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRTlFLFNBQWdCLFFBQVEsQ0FBQyxXQUFtQjtJQUMxQyxPQUFPLElBQUksd0JBQVMsQ0FBQyxrQkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDMUQsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLE1BQWM7SUFDdkMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFGRCxnQ0FFQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUM5QixDQUFDO0FBRkQsZ0NBRUMifQ==