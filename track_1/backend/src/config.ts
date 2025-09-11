import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

export const config = {
  port: Number(process.env.PORT || 4001),
  doma: {
    graphqlEndpoint:
      process.env.DOMA_GRAPHQL_ENDPOINT || 'https://api-testnet.doma.xyz/graphql',
    apiKey: process.env.DOMA_API_KEY || '',
  },
}


