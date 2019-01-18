import { Address, Digest, Signature } from '../BasicTypes';
import { Signer } from 'ethers/abstract-signer';
/**
 * A simple API to provide a uniform signing and identity verification
 */
export interface Identity extends Signer {
    readonly address: Address;
    /**
     * Produces a signature compatible with eth_sign over the message hash.
     *
     * See https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign for the
     * requirement of the message hash
     *
     * @param messageHash A HEX encoded keccak256 hash
     */
    signHash(messageHash: string): Promise<Signature>;
    /**
     * Hashes the message in a manner compatible with eth_sign, then signs it
     * with the private key managed by this identity.
     *
     * See: See https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
     *
     * @param message The message to hash and sign
     */
    hashAndSign(message: string): Promise<Signature>;
}
/**
 * Verify an eth_sign compatible signature
 *
 * @param hash A hash compatible with eth_sign
 * @param sig A signature compatible with eth_sign
 * @param address The address that should have signed the hash
 */
export declare function verifySig(hash: Digest, sig: Signature, address: Address): boolean;
/**
 * Verify a message with a signature produced in an eth_sign compatible signing
 * process.
 *
 * @param message The original message
 * @param sig The signature produced by an eth_sign compatible process
 * @param address The address that should have signed the hash
 */
export declare function verifyMessageSig(message: string, sig: Signature, address: Address): boolean;
/**
 * Compute a signing address from a digest and its signature  with ecrecover
 *
 * @param msgHash The digest that was signed
 * @param sig The signature of the digest
 */
export declare function recoverAddress(msgHash: Digest, sig: string): string;
