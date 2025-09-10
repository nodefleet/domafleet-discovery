import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config'
import domainsRouter from './routes/domains'
import marketRouter from './routes/market'
import offersRouter from './routes/offers'
import { domaGraphql } from './domaClient'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Passthrough: útil si el frontend quiere ejecutar queries arbitrarias
app.post('/api/doma/graphql', async (req, res) => {
  try {
    const { query, variables } = req.body || {}
    if (!query) return res.status(400).json({ error: 'query es requerida' })
    const data = await domaGraphql({ query, variables })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

app.use('/api/domains', domainsRouter)
app.use('/api/market', marketRouter)
app.use('/api/offers', offersRouter)

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`DOMA backend listo en puerto ${config.port}`)
  })
}

export default app


