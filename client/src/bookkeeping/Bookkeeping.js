"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const Hash_1 = require("../libs/Hash");
function emptyAdmission() {
    return {
        root: null
    };
}
exports.emptyAdmission = emptyAdmission;
function admissionDigest(admission) {
    return Hash_1.keccak256(JSON.stringify([admission.root]));
}
exports.admissionDigest = admissionDigest;
function emptyAdmissionDigest() {
    return admissionDigest(emptyAdmission());
}
exports.emptyAdmissionDigest = emptyAdmissionDigest;
// TODO remove, is same as empty one now
function buildAdmission() {
    return {
        root: null
    };
}
exports.buildAdmission = buildAdmission;
function buildAdmissionDigest() {
    return admissionDigest(buildAdmission());
}
exports.buildAdmissionDigest = buildAdmissionDigest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9va2tlZXBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm9va2tlZXBpbmcvQm9va2tlZXBpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTtBQUMvRSwwQ0FBMEM7QUFDMUMsdUJBQXVCO0FBQ3ZCLCtFQUErRTs7QUFTL0UsdUNBQXdDO0FBRXhDLFNBQWdCLGNBQWM7SUFDNUIsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQTtBQUNILENBQUM7QUFKRCx3Q0FJQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxTQUE4QjtJQUM1RCxPQUFPLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEQsQ0FBQztBQUZELDBDQUVDO0FBRUQsU0FBZ0Isb0JBQW9CO0lBQ2xDLE9BQU8sZUFBZSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7QUFDMUMsQ0FBQztBQUZELG9EQUVDO0FBRUQsd0NBQXdDO0FBQ3hDLFNBQWdCLGNBQWM7SUFDNUIsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQTtBQUNILENBQUM7QUFKRCx3Q0FJQztBQUVELFNBQWdCLG9CQUFvQjtJQUNsQyxPQUFPLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO0FBQzFDLENBQUM7QUFGRCxvREFFQyJ9