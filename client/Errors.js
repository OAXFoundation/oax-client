"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = Reflect.getPrototypeOf(this).constructor.name;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SignatureError);
        }
    }
}
class SignatureError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.SignatureError = SignatureError;
class RoundMismatchError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.RoundMismatchError = RoundMismatchError;
class ApprovalNotBackedError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.ApprovalNotBackedError = ApprovalNotBackedError;
class FeeUnpaidError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.FeeUnpaidError = FeeUnpaidError;
class AmountError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.AmountError = AmountError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTtBQUMvRSxNQUFlLFdBQVksU0FBUSxLQUFLO0lBQ3RDLFlBQXNCLE9BQWdCO1FBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVkLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO1FBRXpELHFGQUFxRjtRQUNyRixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1NBQzlDO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBYSxjQUFlLFNBQVEsV0FBVztJQUM3QyxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQixDQUFDO0NBQ0Y7QUFKRCx3Q0FJQztBQUVELE1BQWEsa0JBQW1CLFNBQVEsV0FBVztJQUNqRCxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQixDQUFDO0NBQ0Y7QUFKRCxnREFJQztBQUVELE1BQWEsc0JBQXVCLFNBQVEsV0FBVztJQUNyRCxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQixDQUFDO0NBQ0Y7QUFKRCx3REFJQztBQUVELE1BQWEsY0FBZSxTQUFRLFdBQVc7SUFDN0MsWUFBWSxPQUFnQjtRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDaEIsQ0FBQztDQUNGO0FBSkQsd0NBSUM7QUFFRCxNQUFhLFdBQVksU0FBUSxXQUFXO0lBQzFDLFlBQVksT0FBZ0I7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2hCLENBQUM7Q0FDRjtBQUpELGtDQUlDIn0=