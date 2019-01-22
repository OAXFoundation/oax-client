import { Approval, ApprovalRequestParams, Digest } from './BasicTypes';
export declare function hashApprovalRequestParams(params: ApprovalRequestParams): Digest;
export declare function validateApprovalAmounts(approval: Approval): void;
