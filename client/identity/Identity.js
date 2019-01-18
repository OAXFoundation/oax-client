"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * Verify an eth_sign compatible signature
 *
 * @param hash A hash compatible with eth_sign
 * @param sig A signature compatible with eth_sign
 * @param address The address that should have signed the hash
 */
function verifySig(hash, sig, address) {
    const signedDigest = ethereumjs_util_1.hashPersonalMessage(ethereumjs_util_1.toBuffer(hash));
    const { v, r, s } = ethereumjs_util_1.fromRpcSig(sig);
    const recoveredPubKey = ethereumjs_util_1.ecrecover(signedDigest, v, r, s);
    const recoveredAddress = ethereumjs_util_1.bufferToHex(ethereumjs_util_1.pubToAddress(recoveredPubKey));
    return recoveredAddress.toLowerCase() === address.toLowerCase();
}
exports.verifySig = verifySig;
/**
 * Verify a message with a signature produced in an eth_sign compatible signing
 * process.
 *
 * @param message The original message
 * @param sig The signature produced by an eth_sign compatible process
 * @param address The address that should have signed the hash
 */
function verifyMessageSig(message, sig, address) {
    const hash = ethereumjs_util_1.keccak256(message);
    return verifySig(ethereumjs_util_1.bufferToHex(hash), sig, address);
}
exports.verifyMessageSig = verifyMessageSig;
/**
 * Compute a signing address from a digest and its signature  with ecrecover
 *
 * @param msgHash The digest that was signed
 * @param sig The signature of the digest
 */
function recoverAddress(msgHash, sig) {
    const digest = ethereumjs_util_1.hashPersonalMessage(ethereumjs_util_1.toBuffer(msgHash));
    const { v, r, s } = ethereumjs_util_1.fromRpcSig(sig);
    const recoveredPubKey = ethereumjs_util_1.ecrecover(digest, v, r, s);
    const recoveredAddress = ethereumjs_util_1.pubToAddress(recoveredPubKey);
    return ethereumjs_util_1.bufferToHex(recoveredAddress);
}
exports.recoverAddress = recoverAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWRlbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaWRlbnRpdHkvSWRlbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7QUFJL0UscURBUXdCO0FBOEJ4Qjs7Ozs7O0dBTUc7QUFDSCxTQUFnQixTQUFTLENBQ3ZCLElBQVksRUFDWixHQUFjLEVBQ2QsT0FBZ0I7SUFFaEIsTUFBTSxZQUFZLEdBQUcscUNBQW1CLENBQUMsMEJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3hELE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLDRCQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkMsTUFBTSxlQUFlLEdBQUcsMkJBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN4RCxNQUFNLGdCQUFnQixHQUFHLDZCQUFXLENBQUMsOEJBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO0lBQ25FLE9BQU8sZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pFLENBQUM7QUFWRCw4QkFVQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FDOUIsT0FBZSxFQUNmLEdBQWMsRUFDZCxPQUFnQjtJQUVoQixNQUFNLElBQUksR0FBRywyQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQy9CLE9BQU8sU0FBUyxDQUFDLDZCQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ25ELENBQUM7QUFQRCw0Q0FPQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLE9BQWUsRUFBRSxHQUFXO0lBQ3pELE1BQU0sTUFBTSxHQUFHLHFDQUFtQixDQUFDLDBCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUNyRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRW5DLE1BQU0sZUFBZSxHQUFHLDJCQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEQsTUFBTSxnQkFBZ0IsR0FBRyw4QkFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBRXRELE9BQU8sNkJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFSRCx3Q0FRQyJ9