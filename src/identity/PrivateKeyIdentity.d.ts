/// <reference types="node" />
import { Wallet } from 'ethers/wallet';
import { Provider } from 'ethers/providers';
import { Identity } from './Identity';
import { Signature, Digest } from '../BasicTypes';
export declare class PrivateKeyIdentity extends Wallet implements Identity {
    constructor(privateKey?: string, provider?: Provider);
    signHash(messageHash: Digest): Promise<Signature>;
    hashAndSign(message: string): Promise<Signature>;
}
export declare function randomPrivateKey(): Buffer;
