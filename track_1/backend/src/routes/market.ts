import { Router } from 'express'
import { DomaGraphQLError, domaGraphql, domaMarketplaceGraphql } from '../domaClient.js'

const router = Router()

router.get('/metrics', async (req: any, res: any) => {
  try {
    const tld = (req.query.tld as string | undefined) || undefined
    const query = `
      query MarketplaceMetrics($tld: String) {
        marketplaceMetrics(tld: $tld) {
          items { tld sales24h volume24h }
        }
      }
    `
    const data = await domaMarketplaceGraphql<{ marketplaceMetrics: { items: unknown[] } }>({
      query,
      variables: { tld },
    })
    res.json(data)
  } catch (err) {
    if (err instanceof DomaGraphQLError) return res.status(err.statusCode).json({ error: err.message, details: err.details })
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/recommendations', async (req: any, res: any) => {
  try {
    const { names, minPrice, maxPrice, type } = req.body || {}
    const queries = [
      `query recommendDomains($names: [NameDescriptorInput!]!, $minPrice: Float, $maxPrice: Float, $type: MarketplaceFiltersTypeArg) {
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
      }`,
      `query recommendDomains($names: [NameDescriptorArg!]!, $minPrice: Float, $maxPrice: Float, $type: MarketplaceFiltersType) {
        recommendDomains(names: $names, minPrice: $minPrice, maxPrice: $maxPrice, type: $type) {
          available premium listing { fixedPrice minimumOfferPrice status }
          pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice adjustBy description nativeCurrencyFinalPrice } secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
          chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
          sld tld eoi tokenized favoriteCount secondarySaleAvailable secondarySaleUnavailableReason unavailableReason saleType ownerName nearAccountEscrowed nearAccountAvailable reservationExpiresAt registrant { id } tokenizationStatus
        }
      }`,
    ]

    let lastError: unknown = null
    for (const query of queries) {
      try {
        const data = await domaMarketplaceGraphql<{ recommendDomains: unknown[] }>({ query, variables: { names, minPrice, maxPrice, type } })
        return res.json(data)
      } catch (e) {
        lastError = e
        continue
      }
    }

    // Fallback: usar searchDomains cuando recommendDomains no exista/funcione
    const searchQueries = [
      `query searchDomains($names: [NameDescriptorInput!]!, $size: Int, $type: MarketplaceFiltersTypeArg, $minPrice: Float, $maxPrice: Float) {
        searchDomains(
          names: $names
          size: $size
          type: $type
          minPrice: $minPrice
          maxPrice: $maxPrice
        ) {
          items {
            available premium listing { fixedPrice minimumOfferPrice status }
            pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice adjustBy description nativeCurrencyFinalPrice } secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
            chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
            sld tld eoi tokenized favoriteCount secondarySaleAvailable secondarySaleUnavailableReason unavailableReason saleType ownerName nearAccountEscrowed nearAccountAvailable reservationExpiresAt registrant { id } tokenizationStatus
          }
        }
      }`,
      `query searchDomains($names: [NameDescriptorArg!]!, $size: Int, $type: MarketplaceFiltersType, $minPrice: Float, $maxPrice: Float) {
        searchDomains(
          names: $names
          size: $size
          type: $type
          minPrice: $minPrice
          maxPrice: $maxPrice
        ) {
          items {
            available premium listing { fixedPrice minimumOfferPrice status }
            pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice adjustBy description nativeCurrencyFinalPrice } secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
            chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
            sld tld eoi tokenized favoriteCount secondarySaleAvailable secondarySaleUnavailableReason unavailableReason saleType ownerName nearAccountEscrowed nearAccountAvailable reservationExpiresAt registrant { id } tokenizationStatus
          }
        }
      }`,
    ]

    for (const query of searchQueries) {
      try {
        const data = await domaMarketplaceGraphql<{ searchDomains: { items: any[] } }>({
          query,
          variables: { names, size: 24, type, minPrice, maxPrice },
        })
        const mapped = (data.searchDomains?.items || []).map((it: any) => ({
          available: it.available,
          premium: it.premium,
          listing: it.listing,
          pricing: it.pricing,
          chain: it.chain,
          sld: it.sld,
          tld: it.tld,
          eoi: it.eoi,
          tokenized: it.tokenized,
          favoriteCount: it.favoriteCount,
          secondarySaleAvailable: it.secondarySaleAvailable,
          secondarySaleUnavailableReason: it.secondarySaleUnavailableReason,
          unavailableReason: it.unavailableReason,
          saleType: it.saleType,
          ownerName: it.ownerName,
          nearAccountEscrowed: it.nearAccountEscrowed,
          nearAccountAvailable: it.nearAccountAvailable,
          reservationExpiresAt: it.reservationExpiresAt,
          registrant: it.registrant,
          tokenizationStatus: it.tokenizationStatus,
        }))
        return res.json({ recommendDomains: mapped })
      } catch (e) {
        lastError = e
        continue
      }
    }

    throw lastError instanceof Error ? lastError : new Error('recommendations failed')
  } catch (err) {
    if (err instanceof DomaGraphQLError) return res.status(err.statusCode).json({ error: err.message, details: err.details })
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/search', async (req: any, res: any) => {
  try {
    const {
      names,
      page,
      size,
      sortByPrice,
      sortByDate,
      availableForOffer,
      listedForSale,
      new: isNew,
      maxChars,
      minChars,
      maxPrice,
      minPrice,
      premiumNames,
      type,
    } = req.body || {}

    const queries = [
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
            available
            premium
            listing { fixedPrice minimumOfferPrice status }
            pricing {
              primaryPricingInfo { remainingYearsPrice firstYearPrice description adjustBy nativeCurrencyFinalPrice }
              secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } }
            }
            chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
            sld tld eoi tokenized saleType ownerName registrant { id } favoriteCount unavailableReason secondarySaleAvailable secondarySaleUnavailableReason tokenizationStatus nearAccountEscrowed nearAccountAvailable reservationExpiresAt
          }
        }
      }`,
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
            pricing { primaryPricingInfo { remainingYearsPrice firstYearPrice description adjustBy nativeCurrencyFinalPrice } secondaryPricingInfo { price usdPrice minOfferPrice usdMinOfferPrice currency { decimals symbol icon evmCompatible id name } } }
            chain { id addressType blockExplorerUrl name networkId currency { decimals symbol icon evmCompatible id name } }
            sld tld eoi tokenized saleType ownerName registrant { id } favoriteCount unavailableReason secondarySaleAvailable secondarySaleUnavailableReason tokenizationStatus nearAccountEscrowed nearAccountAvailable reservationExpiresAt
          }
        }
      }`,
    ]

    let lastError: unknown = null
    for (const query of queries) {
      try {
        const data = await domaMarketplaceGraphql({
          query,
          variables: {
            names,
            page,
            size,
            sortByPrice,
            sortByDate,
            availableForOffer,
            listedForSale,
            new: isNew,
            maxChars,
            minChars,
            maxPrice,
            minPrice,
            premiumNames,
            type,
          },
        })
        return res.json(data)
      } catch (e) {
        lastError = e
        continue
      }
    }
    throw lastError instanceof Error ? lastError : new Error('searchDomains failed')
  } catch (err) {
    if (err instanceof DomaGraphQLError) return res.status(err.statusCode).json({ error: err.message, details: err.details })
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router


