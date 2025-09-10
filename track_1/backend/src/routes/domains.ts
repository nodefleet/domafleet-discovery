import { Router } from 'express'
import { domaGraphql } from '../domaClient'

const router = Router()

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params
    const query = `
      query GetDomainInfo($name: String!) {
        name(name: $name) {
          claimedBy
          name
          eoi
          expiresAt
          isFractionalized
          tokenizedAt
          dsKeys { algorithm digest digestType keyTag }
          fractionalTokenInfo {
            address
            status
            id
            chain { name networkId addressUrlTemplate }
            params { symbol name decimals totalSupply }
          }
        }
      }
    `
    const data = await domaGraphql<{ name: unknown }>({ query, variables: { name } })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/:name/activities', async (req, res) => {
  try {
    const { name } = req.params
    const take = Math.min(Number(req.query.take || 50), 200)
    const query = `
      query GetDomainActivities($name: String!, $take: Int!) {
        nameActivities(name: $name, take: $take, sortOrder: DESC) {
          items { type timestamp transactionHash value }
        }
      }
    `
    const data = await domaGraphql<{ nameActivities: { items: unknown[] } }>({
      query,
      variables: { name, take },
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router


