import axios from 'axios';

// Use a default value if the environment variable is not set
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ApiClient = {
    makeRequest: async (method, route, data = {}, responseType = 'json') => {
        try {
            const config = {
                method: method.toLowerCase(),
                url: `${BASE_URL}${route}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,  // This enables sending cookies
                responseType, // Allow responseType to be set (e.g., 'blob' for binary data)
            };

            if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
                config.data = data;
            } else if (method.toLowerCase() === 'get') {
                config.params = data;
            }

            const response = await axios(config);
            return response; // return response.data for non-blob responses
        } catch (error) {
            console.error(`Error making ${method} request to ${route}:`, error);
            throw error;
        }
    },

    makeGetRequest: async (route, params = {}, responseType = 'json') => {
        return ApiClient.makeRequest('GET', route, params, responseType);
    },

    makePostRequest: async (route, data = {}, responseType = 'json') => {
        return ApiClient.makeRequest('POST', route, data, responseType);
    },

    makePutRequest: async (route, data = {}, responseType = 'json') => {
        return ApiClient.makeRequest('PUT', route, data, responseType);
    },

    makeDeleteRequest: async (route, data = {}, responseType = 'json') => {
        return ApiClient.makeRequest('DELETE', route, data, responseType);
    },
};

export default ApiClient;
