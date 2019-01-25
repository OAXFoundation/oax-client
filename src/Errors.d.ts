declare abstract class CustomError extends Error {
    protected constructor(message?: string);
}
export declare class SignatureError extends CustomError {
    constructor(message?: string);
}
export declare class RoundMismatchError extends CustomError {
    constructor(message?: string);
}
export declare class ApprovalNotBackedError extends CustomError {
    constructor(message?: string);
}
export declare class FeeUnpaidError extends CustomError {
    constructor(message?: string);
}
export declare class AmountError extends CustomError {
    constructor(message?: string);
}
export {};
