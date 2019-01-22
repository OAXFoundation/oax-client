export declare const jsonErrorSchema: {
    $schema: string;
    description: string;
    type: string;
    properties: {
        errors: {
            type: string;
            items: {
                $ref: string;
            };
        };
    };
    definitions: {
        error: {
            type: string;
            required: string[];
            properties: {
                status: {
                    description: string;
                    type: string;
                };
                code: {
                    description: string;
                    type: string;
                };
                title: {
                    description: string;
                    type: string;
                };
                detail: {
                    description: string;
                    type: string;
                };
                source: {
                    type: string;
                    properties: {
                        pointer: {
                            description: string;
                            type: string;
                        };
                        parameter: {
                            description: string;
                            type: string;
                        };
                    };
                };
            };
        };
    };
};
