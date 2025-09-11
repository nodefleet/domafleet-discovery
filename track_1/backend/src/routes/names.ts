import { Router } from 'express'
import { domaGraphql } from '../domaClient'

const router = Router()

// GET /api/names?name=&tlds=ai,com&take=48&skip=0&sortOrder=DESC&ownedBy=addr1&ownedBy=addr2&networkIds=1&registrarIanaIds=10&claimStatus=ALL
router.get('/names', async (req, res) => {
  try {
    const name = (req.query.name as string | undefined) || undefined
    const tldsParam = (req.query.tlds as string | undefined) || undefined
    const tlds = tldsParam ? tldsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined
    const take = req.query.take != null ? Number(req.query.take) : undefined
    const skip = req.query.skip != null ? Number(req.query.skip) : undefined
    const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC' | undefined) || undefined
    const ownedBy = req.query.ownedBy
      ? Array.isArray(req.query.ownedBy)
        ? (req.query.ownedBy as string[])
        : [String(req.query.ownedBy)]
      : undefined
    const networkIds = req.query.networkIds
      ? Array.isArray(req.query.networkIds)
        ? (req.query.networkIds as string[])
        : [String(req.query.networkIds)]
      : undefined
    const registrarIanaIds = req.query.registrarIanaIds
      ? (Array.isArray(req.query.registrarIanaIds)
          ? (req.query.registrarIanaIds as string[])
          : [String(req.query.registrarIanaIds)]
        )
          .map((v) => Number(v))
          .filter((n) => !Number.isNaN(n))
      : undefined
    const claimStatus = (req.query.claimStatus as 'CLAIMED' | 'UNCLAIMED' | 'ALL' | undefined) || undefined

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

    const data = await domaGraphql<{
      names: {
        items: { name: string; expiresAt: string | null; tokenizedAt: string | null }[]
        totalCount: number
        hasNextPage: boolean
        currentPage: number
        totalPages: number
      }
    }>({
      query,
      variables: { name, tlds, take, skip, sortOrder, ownedBy, networkIds, registrarIanaIds, claimStatus },
    })

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router


