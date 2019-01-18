"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ethereumjs_util_1 = require("ethereumjs-util");
function shortHash(x) {
    return sha256(x).substr(0, 4);
}
exports.shortHash = shortHash;
function sha256(x) {
    const serialized = serializeMessage(x);
    return crypto_1.createHash('sha256')
        .update(serialized)
        .digest('hex');
}
exports.sha256 = sha256;
function keccak256(message) {
    const serialized = serializeMessage(message);
    return ethereumjs_util_1.bufferToHex(ethereumjs_util_1.keccak256(ethereumjs_util_1.toBuffer(serialized)));
}
exports.keccak256 = keccak256;
function serializeMessage(message) {
    let serialized;
    if (typeof message === 'string') {
        serialized = message;
    }
    else {
        serialized = JSON.stringify(message, Object.keys(message).sort());
    }
    return serialized;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL0hhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7QUFFL0UsbUNBQW1DO0FBRW5DLHFEQUFnRjtBQUloRixTQUFnQixTQUFTLENBQUMsQ0FBTTtJQUM5QixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQy9CLENBQUM7QUFGRCw4QkFFQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxDQUFNO0lBQzNCLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXRDLE9BQU8sbUJBQVUsQ0FBQyxRQUFRLENBQUM7U0FDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbEIsQ0FBQztBQU5ELHdCQU1DO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLE9BQVk7SUFDcEMsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDNUMsT0FBTyw2QkFBVyxDQUFDLDJCQUFVLENBQUMsMEJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEQsQ0FBQztBQUhELDhCQUdDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFZO0lBQ3BDLElBQUksVUFBVSxDQUFBO0lBRWQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsVUFBVSxHQUFHLE9BQU8sQ0FBQTtLQUNyQjtTQUFNO1FBQ0wsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUNsRTtJQUVELE9BQU8sVUFBVSxDQUFBO0FBQ25CLENBQUMifQ==