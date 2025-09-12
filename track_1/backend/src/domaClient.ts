import axios, { AxiosInstance } from 'axios'
import { config } from './config.js'

export class DomaGraphQLError extends Error {
  statusCode: number
  details?: unknown
  constructor(message: string, details?: unknown, statusCode = 400) {
    super(message)
    this.name = 'DomaGraphQLError'
    this.statusCode = statusCode
    this.details = details
  }
}

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

export function createMarketplaceAxios(): AxiosInstance {
  const instance = axios.create({
    baseURL: config.doma.marketplaceEndpoint,
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
    const message = Array.isArray(data.errors) ? (data.errors[0]?.message || 'GraphQL error') : String(data.errors)
    throw new DomaGraphQLError(message, data.errors, 400)
  }

  return data.data as T
}

export async function domaMarketplaceGraphql<T>(request: GraphQLRequest): Promise<T> {
  const client = createMarketplaceAxios()
  const { data } = await client.post('', request)

  if (data?.errors) {
    const message = Array.isArray(data.errors) ? (data.errors[0]?.message || 'GraphQL error') : String(data.errors)
    throw new DomaGraphQLError(message, data.errors, 400)
  }

  return data.data as T
}


