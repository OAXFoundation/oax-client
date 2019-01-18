import { Digest } from '../BasicTypes';
export declare type HashFunction = (x: any) => Digest;
export declare function shortHash(x: any): Digest;
export declare function sha256(x: any): Digest;
export declare function keccak256(message: any): Digest;
