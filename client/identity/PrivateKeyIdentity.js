"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("ethers/wallet");
const crypto_1 = require("crypto");
const { hashPersonalMessage, secp256k1, ecsign, toRpcSig, toBuffer, bufferToHex } = require('ethereumjs-util');
const Hash_1 = require("../libs/Hash");
class PrivateKeyIdentity extends wallet_1.Wallet {
    constructor(privateKey, provider) {
        let pk = privateKey || randomPrivateKey();
        super(pk, provider);
    }
    async signHash(messageHash) {
        const messageDigest = hashPersonalMessage(toBuffer(messageHash));
        const { v, r, s } = ecsign(messageDigest, toBuffer(this.privateKey));
        return Promise.resolve(toRpcSig(v, r, s));
    }
    async hashAndSign(message) {
        const hash = Hash_1.keccak256(message);
        return Promise.resolve(this.signHash(bufferToHex(hash)));
    }
}
exports.PrivateKeyIdentity = PrivateKeyIdentity;
function randomPrivateKey() {
    let privateKey;
    do {
        privateKey = crypto_1.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    return privateKey;
}
exports.randomPrivateKey = randomPrivateKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpdmF0ZUtleUlkZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2lkZW50aXR5L1ByaXZhdGVLZXlJZGVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSwwQ0FBc0M7QUFFdEMsbUNBQW9DO0FBQ3BDLE1BQU0sRUFDSixtQkFBbUIsRUFDbkIsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsUUFBUSxFQUNSLFdBQVcsRUFDWixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRzlCLHVDQUF3QztBQUV4QyxNQUFhLGtCQUFtQixTQUFRLGVBQU07SUFDNUMsWUFBWSxVQUFtQixFQUFFLFFBQW1CO1FBQ2xELElBQUksRUFBRSxHQUFHLFVBQVUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3pDLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBbUI7UUFDaEMsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDaEUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDcEUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBZTtRQUMvQixNQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztDQUNGO0FBaEJELGdEQWdCQztBQUVELFNBQWdCLGdCQUFnQjtJQUM5QixJQUFJLFVBQVUsQ0FBQTtJQUNkLEdBQUc7UUFDRCxVQUFVLEdBQUcsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUM3QixRQUFRLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFDO0lBQ2pELE9BQU8sVUFBVSxDQUFBO0FBQ25CLENBQUM7QUFORCw0Q0FNQyJ9