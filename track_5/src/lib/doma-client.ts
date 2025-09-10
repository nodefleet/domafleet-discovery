import { GraphQLClient } from 'graphql-request';
import axios, { AxiosInstance } from 'axios';

// GraphQL client for Doma Subgraph
export const graphqlClient = new GraphQLClient(
  process.env.REACT_APP_DOMA_SUBGRAPH_URL || 'https://api-testnet.doma.xyz/graphql',
  {
    headers: {
      ...(process.env.REACT_APP_DOMA_API_KEY && {
        'Api-Key': process.env.REACT_APP_DOMA_API_KEY,
      }),
    },
  }
);

// REST API client for Doma API
export const restClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_DOMA_API_BASE_URL || 'https://api-testnet.doma.xyz',
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.REACT_APP_DOMA_API_KEY && {
      'Api-Key': process.env.REACT_APP_DOMA_API_KEY,
    }),
  },
});

// Add request interceptor for debugging
restClient.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
restClient.interceptors.response.use(
  (response) => {
    console.log('API response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - check your API key');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded - please wait before making more requests');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check API connectivity
export async function checkApiHealth(): Promise<{ graphql: boolean; rest: boolean }> {
  const results = { graphql: false, rest: false };

  try {
    // Test GraphQL endpoint
    const graphqlResponse = await graphqlClient.request(`
      query {
        _meta {
          deployment
          hasIndexingErrors
        }
      }
    `);
    results.graphql = !!graphqlResponse;
  } catch (error) {
    console.error('GraphQL health check failed:', error);
  }

  try {
    // Test REST endpoint
    const restResponse = await restClient.get('/health');
    results.rest = restResponse.status === 200;
  } catch (error) {
    console.error('REST health check failed:', error);
  }

  return results;
}

export default {
  graphql: graphqlClient,
  rest: restClient,
  checkHealth: checkApiHealth,
};
