const https = require('https');

describe('API Contract Automation Challenge', () => {
    it('API Contract Automation Challenge - JSON Schema Validation', async () => {
        const url = 'https://pokeapi.co/api/v2/berry/';

        const responseData = await fetchData(url);

        assertResponseMatchesSchema(responseData);
    });
});

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    if (res.statusCode !== 200) {
                        throw new Error(`Unexpected status code: ${res.statusCode}`);
                    }

                    if (!responseData) {
                        throw new Error('Empty response');
                    }

                    resolve(responseData);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON response: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`Failed to make request: ${error.message}`));
        });
    });
}

function assertResponseMatchesSchema(responseData) {
    const schema = {
        "type": "object",
        "properties": {
            "count": {"type": "number"},
            "next": {"type": ["string", "null"]},
            "previous": {"type": ["string", "null"]},
            "results": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "url": {"type": "string"}
                    },
                    "required": ["name", "url"]
                }
            }
        },
        "required": ["count", "results"]
    };

    const errors = [];
    
    if (typeof responseData.count !== 'number') {
        errors.push("The 'count' field should be a number.");
    }
    
    if (!['string', 'null'].includes(typeof responseData.next)) {
        errors.push("The 'next' field should be a string or null.");
    }
    
    if (!['string', 'null', 'object'].includes(typeof responseData.previous)) {
        errors.push("The 'previous' field should be a string or null.");
    }
    
    if (!Array.isArray(responseData.results)) {
        errors.push("The 'results' field should be an array.");
    } else {
        responseData.results.forEach((result, index) => {
            if (typeof result.name !== 'string' || typeof result.url !== 'string') {
                errors.push(`Item at index ${index} in 'results' array has invalid format.`);
            }
        });
    }

    if (errors.length > 0) {
        throw new Error(`Response data validation failed: ${errors.join('\n')}`);
    }
}
