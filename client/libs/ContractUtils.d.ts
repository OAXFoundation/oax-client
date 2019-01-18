import { ContractFactory, Signer, providers } from 'ethers';
import { Address } from '../BasicTypes';
export declare function getContractFactory(name: string, signer: Signer): ContractFactory;
export declare function bigNumberToString(obj: any): any;
/**
 * Convert any instance of Ether's BigNumber instance contained in the argument
 * to BigNumber.js
 * @param obj
 */
export declare function ethersBNToBigNumber(obj: any): any;
export declare function waitForMining(txPromise: Promise<providers.TransactionResponse>): Promise<providers.TransactionReceipt>;
export declare function normalizeAddress(address: Address): Address;
