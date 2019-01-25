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
const fs_1 = require("fs");
const ethers_1 = require("ethers");
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("ethers/utils");
const fs_2 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ethereumjs_util_1 = require("ethereumjs-util");
function projectRoot() {
    let packagePath = path_1.default.join(__dirname, 'package.json');
    let { dir, root, base } = path_1.default.parse(packagePath);
    while (!fs_2.default.existsSync(path_1.default.join(dir, base)) && dir !== root) {
        dir = path_1.default.dirname(dir);
    }
    return dir;
}
function getContractFactory(name, signer) {
    const abi = fs_1.readFileSync(path_1.default.join(projectRoot(), `build/contracts/${name}.abi`)).toString();
    const bin = fs_1.readFileSync(path_1.default.join(projectRoot(), `build/contracts/${name}.bin`)).toString();
    return new ethers_1.ContractFactory(abi, bin, signer);
}
exports.getContractFactory = getContractFactory;
/**
 * Traverse any plain object or array and produce a copy of the same object or
 * array with instance of the argument `type` transformed by the `transform`
 * function
 * @param obj The object to transform
 * @param type The type of the instances to be transform
 * @param transform The transformation function
 */
function traverseAndConvert(obj, type, transform) {
    let result;
    if (obj instanceof type) {
        result = transform(obj);
    }
    else if (obj instanceof Array) {
        result = obj.map(x => traverseAndConvert(x, type, transform));
    }
    else if (!ramda_1.isNil(obj) &&
        typeof obj === 'object' &&
        Reflect.getPrototypeOf(obj) === Object.prototype) {
        const clonedObj = Object.assign({}, obj);
        for (const key of Reflect.ownKeys(clonedObj)) {
            const prop = Reflect.get(clonedObj, key);
            const convertedProp = traverseAndConvert(prop, type, transform);
            Reflect.set(clonedObj, key, convertedProp);
        }
        result = clonedObj;
    }
    else {
        result = obj;
    }
    return result;
}
function bigNumberToString(obj) {
    return traverseAndConvert(obj, bignumber_js_1.BigNumber, (o) => o.toString(10));
}
exports.bigNumberToString = bigNumberToString;
/**
 * Convert any instance of Ether's BigNumber instance contained in the argument
 * to BigNumber.js
 * @param obj
 */
function ethersBNToBigNumber(obj) {
    return traverseAndConvert(obj, utils_1.BigNumber, (o) => new bignumber_js_1.BigNumber(o.toString()));
}
exports.ethersBNToBigNumber = ethersBNToBigNumber;
async function waitForMining(txPromise) {
    const tx = await txPromise;
    return tx.wait();
}
exports.waitForMining = waitForMining;
function normalizeAddress(address) {
    return ethereumjs_util_1.toChecksumAddress(address);
}
exports.normalizeAddress = normalizeAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RVdGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL0NvbnRyYWN0VXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7Ozs7QUFFL0UsaUNBQTZCO0FBQzdCLDJCQUFpQztBQUNqQyxtQ0FBMkQ7QUFDM0QsK0NBQXdDO0FBQ3hDLHdDQUEyRDtBQUMzRCw0Q0FBbUI7QUFDbkIsZ0RBQXVCO0FBRXZCLHFEQUFtRDtBQUVuRCxTQUFTLFdBQVc7SUFDbEIsSUFBSSxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUE7SUFDdEQsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUVqRCxPQUFPLENBQUMsWUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDM0QsR0FBRyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDeEI7SUFFRCxPQUFPLEdBQUcsQ0FBQTtBQUNaLENBQUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FDaEMsSUFBWSxFQUNaLE1BQWM7SUFFZCxNQUFNLEdBQUcsR0FBRyxpQkFBWSxDQUN0QixjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLG1CQUFtQixJQUFJLE1BQU0sQ0FBQyxDQUN4RCxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ1osTUFBTSxHQUFHLEdBQUcsaUJBQVksQ0FDdEIsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxtQkFBbUIsSUFBSSxNQUFNLENBQUMsQ0FDeEQsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUNaLE9BQU8sSUFBSSx3QkFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDOUMsQ0FBQztBQVhELGdEQVdDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQVMsa0JBQWtCLENBQ3pCLEdBQVEsRUFDUixJQUFTLEVBQ1QsU0FBa0M7SUFFbEMsSUFBSSxNQUFNLENBQUE7SUFFVixJQUFJLEdBQUcsWUFBWSxJQUFJLEVBQUU7UUFDdkIsTUFBTSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUN4QjtTQUFNLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtRQUMvQixNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtLQUM5RDtTQUFNLElBQ0wsQ0FBQyxhQUFLLENBQUMsR0FBRyxDQUFDO1FBQ1gsT0FBTyxHQUFHLEtBQUssUUFBUTtRQUN2QixPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQ2hEO1FBQ0EsTUFBTSxTQUFTLHFCQUFRLEdBQUcsQ0FBRSxDQUFBO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM1QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN4QyxNQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQTtTQUMzQztRQUNELE1BQU0sR0FBRyxTQUFTLENBQUE7S0FDbkI7U0FBTTtRQUNMLE1BQU0sR0FBRyxHQUFHLENBQUE7S0FDYjtJQUVELE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLEdBQVE7SUFDeEMsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsd0JBQVMsRUFBRSxDQUFDLENBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzdFLENBQUM7QUFGRCw4Q0FFQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxHQUFRO0lBQzFDLE9BQU8sa0JBQWtCLENBQ3ZCLEdBQUcsRUFDSCxpQkFBZSxFQUNmLENBQUMsQ0FBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSx3QkFBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUNwRCxDQUFBO0FBQ0gsQ0FBQztBQU5ELGtEQU1DO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FDakMsU0FBaUQ7SUFFakQsTUFBTSxFQUFFLEdBQUcsTUFBTSxTQUFTLENBQUE7SUFDMUIsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDbEIsQ0FBQztBQUxELHNDQUtDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsT0FBZ0I7SUFDL0MsT0FBTyxtQ0FBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuQyxDQUFDO0FBRkQsNENBRUMifQ==