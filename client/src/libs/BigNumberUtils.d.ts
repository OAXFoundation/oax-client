/// <reference types="ramda" />
import { BigNumber as EthersBigNumber } from 'ethers/utils/bignumber';
import { BigNumber } from 'bignumber.js';
import { Amount } from '../BasicTypes';
export declare function D(bnStr: TemplateStringsArray | string | BigNumber | EthersBigNumber): BigNumber;
export declare function toEthersBn(n: string | BigNumber): EthersBigNumber;
export declare function sum(bigNums: BigNumber[]): BigNumber;
export declare const add: import("ramda").CurriedFunction2<BigNumber, BigNumber, BigNumber>;
export declare function etherToD(etherString: string): BigNumber;
export declare function etherToWei(amount: Amount): Amount;
export declare function weiToEther(amount: Amount): Amount;
