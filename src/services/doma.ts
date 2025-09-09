const DOMA_TESTNET_ENDPOINT = 'https://api-testnet.doma.xyz/graphql'

export type GraphQLRequest = {
  query: string
  variables?: Record<string, unknown>
}

export async function fetchDoma<T>({ query, variables }: GraphQLRequest): Promise<T> {
  const apiKey = (import.meta as any).env?.VITE_DOMA_API_KEY as string | undefined
  const res = await fetch(DOMA_TESTNET_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    const text = await res.text()
    // Mejorar mensaje cuando falta API Key
    if (res.status === 401 && /API Key is missing/i.test(text)) {
      throw new Error(
        'DOMA GraphQL 401: falta API Key. Define VITE_DOMA_API_KEY en tu entorno (.env) para autenticarte.'
      )
    }
    throw new Error(`DOMA GraphQL error: ${res.status} ${text}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`DOMA GraphQL errors: ${JSON.stringify(json.errors)}`)
  }
  return json.data as T
}

// Ejemplo: obtener nombres tokenizados (paginado simple)
export async function getTokenizedNames({ take = 12, skip = 0 }: { take?: number; skip?: number }) {
  const query = `
    query Names($take: Int, $skip: Int) {
      names(take: $take, skip: $skip) {
        items { name expiresAt tokenizedAt }
        totalCount
        currentPage
        totalPages
        hasNextPage
      }
    }
  `

  return fetchDoma<{ names: { items: { name: string; expiresAt: string; tokenizedAt: string }[] } }>({
    query,
    variables: { take, skip },
  })
}

export async function getName(name: string) {
  const query = `
    query Name($name: String!) {
      name(name: $name) {
        name
        expiresAt
        tokenizedAt
        registrar { name ianaId }
        tokens { tokenId networkId ownerAddress type startsAt expiresAt }
      }
    }
  `
  return fetchDoma<{ name: { name: string; expiresAt: string; tokenizedAt: string; tokens: { tokenId: string }[] } }>({
    query,
    variables: { name },
  })
}

export async function getNameActivities(name: string, { take = 20, skip = 0 }: { take?: number; skip?: number } = {}) {
  const query = `
    query NameActivities($name: String!, $take: Int, $skip: Int) {
      nameActivities(name: $name, take: $take, skip: $skip) {
        items {
          type
          createdAt
        }
        totalCount
        hasNextPage
      }
    }
  `
  return fetchDoma<{ nameActivities: { items: { type: string; createdAt: string }[]; hasNextPage: boolean } }>({
    query,
    variables: { name, take, skip },
  })
}

export async function getListings({ take = 12, skip = 0 }: { take?: number; skip?: number } = {}) {
  const query = `
    query Listings($take: Int, $skip: Int) {
      listings(take: $take, skip: $skip) {
        items {
          id
          price
          currency { symbol }
          name
          expiresAt
          createdAt
        }
        totalCount
        hasNextPage
      }
    }
  `
  return fetchDoma<{ listings: { items: { id: string; name: string; price: string; createdAt: string; expiresAt: string; currency: { symbol: string } }[] } }>({
    query,
    variables: { take, skip },
  })
}

export async function getOffers({ tokenId, take = 10, skip = 0 }: { tokenId?: string; take?: number; skip?: number }) {
  const query = `
    query Offers($tokenId: String, $take: Int, $skip: Int) {
      offers(tokenId: $tokenId, take: $take, skip: $skip) {
        items {
          id
          price
          status
          currency { symbol }
          expiresAt
          createdAt
        }
        totalCount
        hasNextPage
      }
    }
  `
  return fetchDoma<{ offers: { items: { id: string; price: string; status: string; createdAt: string; expiresAt: string; currency: { symbol: string } }[] } }>({
    query,
    variables: { tokenId, take, skip },
  })
}


