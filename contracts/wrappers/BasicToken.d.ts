/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter } from "ethers";
import { Provider } from "ethers/providers";
import { BigNumber } from "ethers/utils";

export class BasicToken extends Contract {
  functions: {
    balanceOf(_owner: string): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: number | string
    ): Promise<ContractTransaction>;

    totalSupply(): Promise<BigNumber>;
  };
  filters: {
    Transfer(from: string | null, to: string | null, value: null): EventFilter;
  };
}