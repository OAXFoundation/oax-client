"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonErrorSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    description: 'A representation of a person, company, organization, or place',
    type: 'object',
    properties: {
        errors: {
            type: 'array',
            items: { $ref: '#/definitions/error' }
        }
    },
    definitions: {
        error: {
            type: 'object',
            required: ['status', 'source', 'title', 'detail'],
            properties: {
                status: {
                    description: 'The HTTP status code applicable to this problem, expressed as a string value.',
                    type: 'string'
                },
                code: {
                    description: 'An application-specific error code, expressed as a string value.',
                    type: 'string'
                },
                title: {
                    description: 'A short, human-readable summary of the problem. It **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization.',
                    type: 'string'
                },
                detail: {
                    description: 'A human-readable explanation specific to this occurrence of the problem.',
                    type: 'string'
                },
                source: {
                    type: 'object',
                    properties: {
                        pointer: {
                            description: 'A JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].',
                            type: 'string'
                        },
                        parameter: {
                            description: 'A string indicating which query parameter caused the error.',
                            type: 'string'
                        }
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSnNvblNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90cmFuc3BvcnQvSnNvblNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUVsRSxRQUFBLGVBQWUsR0FBRztJQUM3QixPQUFPLEVBQUUseUNBQXlDO0lBQ2xELFdBQVcsRUFBRSwrREFBK0Q7SUFDNUUsSUFBSSxFQUFFLFFBQVE7SUFDZCxVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRTtTQUN2QztLQUNGO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7WUFDakQsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRTtvQkFDTixXQUFXLEVBQ1QsK0VBQStFO29CQUNqRixJQUFJLEVBQUUsUUFBUTtpQkFDZjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osV0FBVyxFQUNULGtFQUFrRTtvQkFDcEUsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLFdBQVcsRUFDVCw2SkFBNko7b0JBQy9KLElBQUksRUFBRSxRQUFRO2lCQUNmO2dCQUNELE1BQU0sRUFBRTtvQkFDTixXQUFXLEVBQ1QsMEVBQTBFO29CQUM1RSxJQUFJLEVBQUUsUUFBUTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLE9BQU8sRUFBRTs0QkFDUCxXQUFXLEVBQ1QsMktBQTJLOzRCQUM3SyxJQUFJLEVBQUUsUUFBUTt5QkFDZjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsV0FBVyxFQUNULDZEQUE2RDs0QkFDL0QsSUFBSSxFQUFFLFFBQVE7eUJBQ2Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFBIn0=