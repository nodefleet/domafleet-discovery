import { Router } from 'express'
import { domaGraphql } from '../domaClient'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const tokenId = req.query.tokenId as string | undefined
    const take = Math.min(Number(req.query.take || 10), 100)
    const skip = Math.max(Number(req.query.skip || 0), 0)
    if (!tokenId) return res.status(400).json({ error: 'tokenId es requerido' })

    const query = `
      query GetOffers($tokenId: String!, $take: Int!, $skip: Int!) {
        offers(tokenId: $tokenId, take: $take, skip: $skip) {
          items { id price createdAt maker }
          totalCount
        }
      }
    `
    const data = await domaGraphql<{ offers: { items: unknown[]; totalCount: number } }>({
      query,
      variables: { tokenId, take, skip },
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router


