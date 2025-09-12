import axios, { AxiosError, AxiosInstance } from 'axios'
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
  try {
    const { data } = await client.post('', request)
    if (data?.errors) {
      const message = Array.isArray(data.errors) ? (data.errors[0]?.message || 'GraphQL error') : String(data.errors)
      throw new DomaGraphQLError(message, data.errors, 400)
    }
    return data.data as T
  } catch (e) {
    const err = e as AxiosError<any>
    if (err.response) {
      const status = err.response.status
      const body = err.response.data
      const message = body?.errors?.[0]?.message || body?.message || err.message || 'Request failed'
      throw new DomaGraphQLError(message, body?.errors || body, status)
    }
    throw e
  }
}

export async function domaMarketplaceGraphql<T>(request: GraphQLRequest): Promise<T> {
  // Validar que el endpoint de marketplace sea distinto al subgraph por defecto
  if (config.doma.marketplaceEndpoint === config.doma.graphqlEndpoint) {
    throw new DomaGraphQLError(
      'DOMA_MARKETPLACE_ENDPOINT no configurado o apunta al subgraph. Define DOMA_MARKETPLACE_ENDPOINT a la URL del Marketplace GraphQL que soporta recommendDomains.',
      { hint: 'Set DOMA_MARKETPLACE_ENDPOINT en backend/.env' },
      400
    )
  }
  const client = createMarketplaceAxios()
  try {
    const { data } = await client.post('', request)
    if (data?.errors) {
      const message = Array.isArray(data.errors) ? (data.errors[0]?.message || 'GraphQL error') : String(data.errors)
      throw new DomaGraphQLError(message, data.errors, 400)
    }
    return data.data as T
  } catch (e) {
    const err = e as AxiosError<any>
    if (err.response) {
      const status = err.response.status
      const body = err.response.data
      const message = body?.errors?.[0]?.message || body?.message || err.message || 'Request failed'
      throw new DomaGraphQLError(message, body?.errors || body, status)
    }
    throw e
  }
}


