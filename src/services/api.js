/**
 * API Service for Password Generation
 * Communicates with Django backend at http://127.0.0.1:8000/api/generate/
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Build request payload based on mode and frontend options
 * @param {string} mode - 'random' | 'memorable' | 'pin'
 * @param {object} options - Frontend state options
 * @returns {object} Backend-compatible request payload
 */
function buildRequestPayload(mode, options) {
    switch (mode) {
        case 'pin':
            return {
                mode: 'pin',
                config: {
                    length: options.length
                }
            };

        case 'random':
            return {
                mode: 'random',
                config: {
                    length: options.length,
                    character_sets: {
                        uppercase: options.uppercase,
                        lowercase: options.lowercase,
                        numbers: options.numbers,
                        symbols: options.symbols
                    }
                }
            };

        case 'memorable':
            return {
                mode: 'memorable',
                config: {
                    word_count: options.length, // Frontend uses 'length' for word count
                    include_numbers: options.includeNumbers
                }
            };

        default:
            throw new Error(`Unknown mode: ${mode}`);
    }
}

/**
 * Generate password via backend API
 * @param {string} mode - Password generation mode
 * @param {object} options - Frontend options state
 * @returns {Promise<object>} Backend response with password and strength
 */
export async function generatePassword(mode, options) {
    const payload = buildRequestPayload(mode, options);

    try {
        const response = await fetch(`${API_BASE_URL}/generate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate response structure
        if (!data.password || !data.strength) {
            throw new Error('Invalid response format from backend');
        }

        return data;
    } catch (error) {
        // Network or parsing errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to backend. Is the server running at http://127.0.0.1:8000?');
        }
        throw error;
    }
}
