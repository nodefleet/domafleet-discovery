import axios, { AxiosInstance } from 'axios'
import { config } from './config.js'

export function createDomaAxios(): AxiosInstance {
  const instance = axios.create({
    baseURL: config.doma.graphqlEndpoint,
    headers: {
      'Content-Type': 'application/json',
      ...(config.doma.apiKey ? { 'Api-Key': config.doma.apiKey } : {}),
    },
    timeout: 15000,
    withCredentials: false,
  })

  return instance
}

export type GraphQLRequest = {
  query: string
  variables?: Record<string, unknown>
}

export async function domaGraphql<T>(request: GraphQLRequest): Promise<T> {
  const client = createDomaAxios()
  const { data } = await client.post('', request)

  if (data?.errors) {
    const message = Array.isArray(data.errors) ? JSON.stringify(data.errors) : String(data.errors)
    throw new Error(`DOMA GraphQL errors: ${message}`)
  }

  return data.data as T
}


