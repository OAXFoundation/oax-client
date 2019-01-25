import { Address } from './BasicTypes';
export declare class AssetRegistry {
    private symbolAddresses;
    private addressSymbols;
    add(symbol: string, address: Address): void;
    getAddress(name: string): Address | undefined;
    getSymbol(address: Address): string | undefined;
}
export declare function verifySymbol(symbol: string): Error | null;
