import { Router } from 'express'
import { domaGraphql } from '../domaClient'

const router = Router()

router.get('/metrics', async (req, res) => {
  try {
    const tld = (req.query.tld as string | undefined) || undefined
    const query = `
      query MarketplaceMetrics($tld: String) {
        marketplaceMetrics(tld: $tld) {
          items { tld sales24h volume24h }
        }
      }
    `
    const data = await domaGraphql<{ marketplaceMetrics: { items: unknown[] } }>({
      query,
      variables: { tld },
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/recommendations', async (req, res) => {
  try {
    const { names, minPrice, maxPrice, type } = req.body || {}
    const query = `
      query recommendDomains($names: [NameDescriptorInput!]!, $minPrice: Float, $maxPrice: Float, $type: MarketplaceFiltersTypeArg) {
        recommendDomains(names: $names, minPrice: $minPrice, maxPrice: $maxPrice, type: $type) {
          sld tld available premium saleType
          pricing { primaryPricingInfo { firstYearPrice } secondaryPricingInfo { price } }
        }
      }
    `
    const data = await domaGraphql<{ recommendDomains: unknown[] }>({
      query,
      variables: { names, minPrice, maxPrice, type },
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router


