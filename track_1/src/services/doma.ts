import axios, { AxiosError } from 'axios'

// Redirigido al backend interno
const BACKEND_GRAPHQL_ENDPOINT = '/api/doma/graphql'

export type GraphQLRequest = {
  query: string
  variables?: Record<string, unknown>
}

export async function fetchDoma<T>({ query, variables }: GraphQLRequest): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  try {
    const { data } = await axios.post(
      BACKEND_GRAPHQL_ENDPOINT,
      { query, variables },
      { headers, timeout: 15000, withCredentials: false }
    )

    if (data?.errors) {
      const missingApiKey = Array.isArray(data.errors) && data.errors.some((e: any) => /API Key is missing/i.test(e?.message))
      if (missingApiKey) {
        throw new Error('DOMA GraphQL 401: falta API Key en backend. Define DOMA_API_KEY en track_1/backend/.env y reinicia el backend.')
      }
      const ipNotAllowed = Array.isArray(data.errors) && data.errors.some((e: any) => /IP address not allowed/i.test(e?.message))
      if (ipNotAllowed) {
        throw new Error('DOMA GraphQL 401: IP del backend no permitida para esa API Key. Actualiza la whitelist de IPs en DOMA o usa otra clave.')
      }
      throw new Error(`DOMA GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    return data.data as T
  } catch (err) {
    const axiosErr = err as AxiosError
    if (axiosErr.code === 'ECONNABORTED') {
      throw new Error('DOMA GraphQL timeout: la petición excedió 15s. Reintenta.')
    }
    if (axiosErr.response) {
      const status = axiosErr.response.status
      const text = JSON.stringify(axiosErr.response.data)
      if (status === 401 && /IP address not allowed/i.test(text)) {
        throw new Error('DOMA GraphQL 401: IP del backend no permitida para esa API Key. Actualiza la whitelist de IPs en DOMA o usa otra clave.')
      }
      if (status === 401 && /API Key is missing/i.test(text)) {
        throw new Error('DOMA GraphQL 401: falta API Key en backend. Define DOMA_API_KEY en track_1/backend/.env y reinicia el backend.')
      }
      throw new Error(`DOMA GraphQL error: ${status} ${text}`)
    }
    throw axiosErr
  }
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


// Nuevos endpoints solicitados
export async function getDomainInfo(name: string) {
  const query = `
    query GetDomainInfo($name: String!) {
      name(name: $name) {
        claimedBy
        name
        eoi
        expiresAt
        isFractionalized
        tokenizedAt
        dsKeys {
          algorithm
          digest
          digestType
          keyTag
          __typename
        }
        fractionalTokenInfo {
          address
          boughtOutAt
          boughtOutBy
          boughtOutTxHash
          buyoutPrice
          chain {
            addressUrlTemplate
            name
            networkId
            __typename
          }
          fractionalizedAt
          fractionalizedBy
          fractionalizedTxHash
          id
          launchpadAddress
          params {
            decimals
            finalLaunchpadPrice
            initialLaunchpadPrice
            initialPoolPrice
            initialValuation
            launchEndDate
            launchpadData
            launchpadFeeBps
            launchpadFeeBps
            launchpadSupply
            launchpadType
            launchStartDate
            name
            poolFeeBps
            symbol
            poolSupply
            symbol
            totalSupply
            vestingCliffSeconds
            vestingDurationSeconds
            __typename
          }
          poolAddress
          status
          vestingWalletAddress
          __typename
        }
      }
    }
  `

  type DsKey = {
    algorithm?: string
    digest?: string
    digestType?: string
    keyTag?: number | string
    __typename?: string
  }

  type FractionalTokenInfo = {
    address?: string
    boughtOutAt?: string
    boughtOutBy?: string
    boughtOutTxHash?: string
    buyoutPrice?: string | number
    chain?: { addressUrlTemplate?: string; name?: string; networkId?: number | string; __typename?: string }
    fractionalizedAt?: string
    fractionalizedBy?: string
    fractionalizedTxHash?: string
    id?: string
    launchpadAddress?: string
    params?: {
      decimals?: number
      finalLaunchpadPrice?: string | number
      initialLaunchpadPrice?: string | number
      initialPoolPrice?: string | number
      initialValuation?: string | number
      launchEndDate?: string
      launchpadData?: string
      launchpadFeeBps?: number | string
      launchpadSupply?: string | number
      launchpadType?: string
      launchStartDate?: string
      name?: string
      poolFeeBps?: number | string
      symbol?: string
      poolSupply?: string | number
      totalSupply?: string | number
      vestingCliffSeconds?: number | string
      vestingDurationSeconds?: number | string
      __typename?: string
    }
    poolAddress?: string
    status?: string
    vestingWalletAddress?: string
    __typename?: string
  }

  return fetchDoma<{
    name: {
      claimedBy?: string
      name: string
      eoi?: string | number
      expiresAt?: string
      isFractionalized?: boolean
      tokenizedAt?: string
      dsKeys?: DsKey[]
      fractionalTokenInfo?: FractionalTokenInfo | null
    }
  }>({
    query,
    variables: { name },
  })
}

export async function getDomainActivities2(name: string, take: number) {
  const query = `
    query GetDomainActivities($name: String!, $take: Int!) {
      nameActivities(name: $name, take: $take, sortOrder: DESC) {
        items {
          type
          timestamp
          transactionHash
          value
        }
      }
    }
  `
  return fetchDoma<{ nameActivities: { items: { type: string; timestamp: string; transactionHash?: string; value?: string }[] } }>({
    query,
    variables: { name, take },
  })
}

// Deshabilitado temporalmente: el esquema actual no soporta el campo "seller" en NameListingModel
// export async function getDomainListingsBySld(sld: string) { /* ... */ }

// Search domains (según query provisto)
export async function searchDomains(args: {
  names: { sld: string; tld: string }[]
  page?: number
  size?: number
  sortByPrice?: 'ASC' | 'DESC'
  sortByDate?: 'ASC' | 'DESC'
  availableForOffer?: boolean
  listedForSale?: boolean
  new?: boolean
  maxChars?: number
  minChars?: number
  maxPrice?: number
  minPrice?: number
  premiumNames?: boolean
  type?: string
}) {
  const queries = [
    // Variant A: as provided
    `query searchDomains($names: [NameDescriptorInput!]!, $page: Int, $size: Int, $sortByPrice: SortOrder, $sortByDate: SortOrder, $availableForOffer: Boolean, $listedForSale: Boolean, $new: Boolean, $maxChars: Int, $minChars: Int, $maxPrice: Float, $minPrice: Float, $premiumNames: Boolean, $type: MarketplaceFiltersTypeArg) {
      searchDomains(
        names: $names
        page: $page
        size: $size
        sortByPrice: $sortByPrice
        sortByDate: $sortByDate
        availableForOffer: $availableForOffer
        listedForSale: $listedForSale
        new: $new
        maxChars: $maxChars
        minChars: $minChars
        maxPrice: $maxPrice
        minPrice: $minPrice
        premiumNames: $premiumNames
        type: $type
      ) {
        currentPage
        hasNextPage
        hasPreviousPage
        pageSize
        totalCount
        totalPages
        brandingInfo { tld styling { fontColor primaryColor secondaryColor logo { url } } }
        items {
          available premium listing { fixedPrice minimumOfferPrice status }
          pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice description adjustBy nativeCurrencyFinalPrice }
                   secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
          chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
          sld tld eoi tokenized saleType ownerName registrant { id } favoriteCount unavailableReason secondarySaleAvailable secondarySaleUnavailableReason tokenizationStatus nearAccountEscrowed nearAccountAvailable reservationExpiresAt
        }
      }
    }`,
    // Variant B: alternate type names
    `query searchDomains($names: [NameDescriptorArg!]!, $page: Int, $size: Int, $sortByPrice: SortOrderType, $sortByDate: SortOrderType, $availableForOffer: Boolean, $listedForSale: Boolean, $new: Boolean, $maxChars: Int, $minChars: Int, $maxPrice: Float, $minPrice: Float, $premiumNames: Boolean, $type: MarketplaceFiltersType) {
      searchDomains(
        names: $names
        page: $page
        size: $size
        sortByPrice: $sortByPrice
        sortByDate: $sortByDate
        availableForOffer: $availableForOffer
        listedForSale: $listedForSale
        new: $new
        maxChars: $maxChars
        minChars: $minChars
        maxPrice: $maxPrice
        minPrice: $minPrice
        premiumNames: $premiumNames
        type: $type
      ) {
        currentPage hasNextPage hasPreviousPage pageSize totalCount totalPages
        brandingInfo { tld styling { fontColor primaryColor secondaryColor logo { url } } }
        items {
          available premium listing { fixedPrice minimumOfferPrice status }
          pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice description adjustBy nativeCurrencyFinalPrice }
                   secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
          chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
          sld tld eoi tokenized saleType ownerName registrant { id } favoriteCount unavailableReason secondarySaleAvailable secondarySaleUnavailableReason tokenizationStatus nearAccountEscrowed nearAccountAvailable reservationExpiresAt
        }
      }
    }`,
    // Variant C: alternate field name
    `query searchDomains($names: [NameDescriptorArg!]!, $page: Int, $size: Int, $sortByPrice: SortOrderType, $sortByDate: SortOrderType, $availableForOffer: Boolean, $listedForSale: Boolean, $new: Boolean, $maxChars: Int, $minChars: Int, $maxPrice: Float, $minPrice: Float, $premiumNames: Boolean, $type: MarketplaceFiltersType) {
      searchNames(
        names: $names
        page: $page
        size: $size
        sortByPrice: $sortByPrice
        sortByDate: $sortByDate
        availableForOffer: $availableForOffer
        listedForSale: $listedForSale
        new: $new
        maxChars: $maxChars
        minChars: $minChars
        maxPrice: $maxPrice
        minPrice: $minPrice
        premiumNames: $premiumNames
        type: $type
      ) {
        currentPage hasNextPage hasPreviousPage pageSize totalCount totalPages
        brandingInfo { tld styling { fontColor primaryColor secondaryColor logo { url } } }
        items {
          available premium listing { fixedPrice minimumOfferPrice status }
          pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice description adjustBy nativeCurrencyFinalPrice }
                   secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
          chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
          sld tld eoi tokenized saleType ownerName registrant { id } favoriteCount unavailableReason secondarySaleAvailable secondarySaleUnavailableReason tokenizationStatus nearAccountEscrowed nearAccountAvailable reservationExpiresAt
        }
      }
    }`,
  ]

  const lastErrors: string[] = []
  for (const q of queries) {
    try {
      return await fetchDoma<{
        searchDomains?: {
          items: Array<{
            available: boolean
            premium: boolean
            listing: { fixedPrice?: number; minimumOfferPrice?: number; status?: string } | null
            pricing: {
              primaryPricingInfo: { remainingYearsPrice?: number; firstYearPrice?: number; description?: string | null; adjustBy?: number; nativeCurrencyFinalPrice?: string | null } | null
              secondaryPricingInfo: { price?: number; usdPrice?: number; minOfferPrice?: number; usdMinOfferPrice?: number; currency?: { symbol?: string } } | null
            } | null
            chain: { name?: string; networkId?: string } | null
            sld: string
            tld: string
            eoi: boolean
            tokenized: boolean
            saleType: string
          }>
          totalCount: number
          currentPage: number
          pageSize: number
          totalPages: number
          hasNextPage: boolean
        }
        searchNames?: {
          items: any[]
          totalCount: number
          currentPage: number
          pageSize: number
          totalPages: number
          hasNextPage: boolean
        }
      }>({ query: q, variables: args })
    } catch (e: any) {
      lastErrors.push(String(e?.message || e))
    }
  }
  throw new Error(lastErrors.join(' | '))
}

// Recommend domains
export async function recommendDomains(args: {
  names: { sld: string; tld: string }[]
  minPrice?: number
  maxPrice?: number
  type?: string
}) {
  const query = `
    query recommendDomains($names: [NameDescriptorInput!]!, $minPrice: Float, $maxPrice: Float, $type: MarketplaceFiltersTypeArg) {
      recommendDomains(names: $names, minPrice: $minPrice, maxPrice: $maxPrice, type: $type) {
        available
        premium
        listing { fixedPrice minimumOfferPrice status }
        pricing {
          primaryPricingInfo { remainingYearsPrice firstYearPrice adjustBy description nativeCurrencyFinalPrice }
          secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } }
        }
        chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
        sld
        tld
        eoi
        tokenized
        favoriteCount
        secondarySaleAvailable
        secondarySaleUnavailableReason
        unavailableReason
        saleType
        ownerName
        nearAccountEscrowed
        nearAccountAvailable
        reservationExpiresAt
        registrant { id }
        tokenizationStatus
      }
    }
  `

  return fetchDoma<{
    recommendDomains: Array<{
      sld: string
      tld: string
      available: boolean
      premium: boolean
      pricing: { primaryPricingInfo?: { firstYearPrice?: number } | null; secondaryPricingInfo?: { price?: number } | null } | null
      saleType?: string
    }>
  }>({ query, variables: args })
}

// Marketplace metrics
export async function marketplaceMetrics(args: { tld?: string } = {}) {
  const query = `
    query MarketplaceMetrics($tld: String) {
      marketplaceMetrics(tld: $tld) {
        brandingInfo { tld styling { squareLogo { url } } }
        items {
          tld
          sales24h
          previous24hSales
          sales7d
          previous7dSales
          sales30d
          previous30dSales
          listed
          minted
          sales
          volume24h
          previous24hVolume
          volume7d
          previous7dVolume
          volume30d
          previous30dVolume
          volume
        }
      }
    }
  `

  return fetchDoma<{ marketplaceMetrics: { items: Array<{ tld: string; sales24h: number; volume24h: number }> } }>({
    query,
    variables: args,
  })
}

// Subgraph: names (search/paginated)
export async function searchNames(args: {
  name?: string
  tlds?: string[]
  take?: number
  skip?: number
  sortOrder?: 'ASC' | 'DESC'
  ownedBy?: string[]
  networkIds?: string[]
  registrarIanaIds?: number[]
  claimStatus?: 'CLAIMED' | 'UNCLAIMED' | 'ALL'
}) {
  const query = `
    query Names($name: String, $tlds: [String!], $take: Int, $skip: Int, $sortOrder: SortOrderType, $ownedBy: [AddressCAIP10!], $networkIds: [String!], $registrarIanaIds: [Int!], $claimStatus: NamesQueryClaimStatus) {
      names(
        name: $name
        tlds: $tlds
        take: $take
        skip: $skip
        sortOrder: $sortOrder
        ownedBy: $ownedBy
        networkIds: $networkIds
        registrarIanaIds: $registrarIanaIds
        claimStatus: $claimStatus
      ) {
        items { name expiresAt tokenizedAt }
        totalCount
        currentPage
        totalPages
        hasNextPage
      }
    }
  `

  return fetchDoma<{
    names: {
      items: { name: string; expiresAt: string | null; tokenizedAt: string | null }[]
      totalCount: number
      hasNextPage: boolean
      currentPage: number
      totalPages: number
    }
  }>({ query, variables: args })
}

