import axios from 'axios'

const api = axios.create({
  // Asume mismo host/origen del frontend; usa rutas relativas
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: false,
})

export type NameDescriptor = { sld: string; tld: string }

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


