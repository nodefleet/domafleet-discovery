import axios, { AxiosError } from 'axios'

const api = axios.create({
  // Usa el backend desplegado de DOMAFleet
  baseURL: 'https://api.domafleet.io',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: false,
})

// Propagar mensajes de error del backend hacia el frontend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error as AxiosError<any>
    const backendMessage = (err.response?.data as any)?.error || (err.response?.data as any)?.message
    const statusText = err.response ? `${err.response.status}` : ''
    const message = backendMessage || err.message || 'Request failed'
    return Promise.reject(new Error(statusText ? `${statusText}: ${message}` : message))
  }
)

export type NameDescriptor = { sld: string; tld: string }

export async function searchNames(params: { name?: string; tlds?: string[]; take?: number; skip?: number; sortOrder?: 'ASC' | 'DESC'; ownedBy?: string[]; networkIds?: string[]; registrarIanaIds?: number[]; claimStatus?: 'CLAIMED' | 'UNCLAIMED' | 'ALL' }) {
  const qs = new URLSearchParams({
    ...(params.name ? { name: params.name } : {}),
    ...(params.tlds && params.tlds.length ? { tlds: params.tlds.join(',') } : {}),
    ...(params.take != null ? { take: String(params.take) } : {}),
    ...(params.skip != null ? { skip: String(params.skip) } : {}),
    ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
    ...(params.claimStatus ? { claimStatus: params.claimStatus } : {}),
  })
  // Arrays repetibles
  const repeatParams = new URLSearchParams()
  params.ownedBy?.forEach((v) => repeatParams.append('ownedBy', v))
  params.networkIds?.forEach((v) => repeatParams.append('networkIds', v))
  params.registrarIanaIds?.forEach((v) => repeatParams.append('registrarIanaIds', String(v)))
  const sep = qs.toString() && repeatParams.toString() ? '&' : ''
  const fullQs = `${qs.toString()}${sep}${repeatParams.toString()}`
  const { data } = await api.get(`/api/names?${fullQs}`)
  return data as {
    names: {
      items: { name: string; expiresAt: string | null; tokenizedAt: string | null }[]
      totalCount: number
      currentPage: number
      totalPages: number
      hasNextPage: boolean
    }
  }
}

export async function healthcheck() {
  const { data } = await api.get('/health')
  return data as { ok: boolean }
}

export async function graphql<T>(query: string, variables?: Record<string, unknown>) {
  const { data } = await api.post('/api/doma/graphql', { query, variables })
  return data as T
}

export async function getDomain(name: string) {
  const { data } = await api.get(`/api/domains/${encodeURIComponent(name)}`)
  return data as { name: unknown }
}

export async function getDomainActivities(name: string, take = 50) {
  const params = new URLSearchParams({ take: String(take) }).toString()
  const { data } = await api.get(`/api/domains/${encodeURIComponent(name)}/activities?${params}`)
  return data as { nameActivities: { items: unknown[] } }
}

export async function getMarketplaceMetrics(tld?: string) {
  const qs = tld ? `?tld=${encodeURIComponent(tld)}` : ''
  const { data } = await api.get(`/api/market/metrics${qs}`)
  return data as { marketplaceMetrics: { items: unknown[] } }
}

export async function recommendDomains(names: NameDescriptor[], opts?: { minPrice?: number; maxPrice?: number; type?: string }) {
  const { data } = await api.post('/api/market/recommendations', {
    names,
    ...opts,
  })
  return data as { recommendDomains: unknown[] }
}

export async function getOffers(params: { tokenId: string; take?: number; skip?: number }) {
  const qs = new URLSearchParams({
    tokenId: params.tokenId,
    ...(params.take ? { take: String(params.take) } : {}),
    ...(params.skip ? { skip: String(params.skip) } : {}),
  }).toString()
  const { data } = await api.get(`/api/offers?${qs}`)
  return data as { offers: { items: unknown[]; totalCount: number } }
}


