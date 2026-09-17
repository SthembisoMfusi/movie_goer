export const searchPersonSchema = {
    querystring: {
        type: 'object',
        required: ['q'], 
        properties: {
            q: { type: 'string', minLength: 1 },
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
        }
    }
};

export const getPersonByIdSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', minLength: 1 }
        }
    }
};

export const getPersonCreditsSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', minLength: 1 }
        }
    },
    querystring: {
        type: 'object',
        properties: {
            
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
        }
    }
};