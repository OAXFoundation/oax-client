/**
 * Pure functions to bookkeeping.
 *
 * @module src/bookkeeping/Bookkeeping
 * @see module:src/bookkeeping/ClientBookkeeping
 */
import { Digest, Admission } from '../BasicTypes';
export declare function emptyAdmission(): Admission;
export declare function admissionDigest(admission: Readonly<Admission>): Digest;
export declare function emptyAdmissionDigest(): Digest;
export declare function buildAdmission(): Admission;
export declare function buildAdmissionDigest(): Digest;
