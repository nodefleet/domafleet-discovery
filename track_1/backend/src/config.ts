import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT || 4001),
  doma: {
    graphqlEndpoint:
      process.env.DOMA_GRAPHQL_ENDPOINT || 'https://api-testnet.doma.xyz/graphql',
    apiKey: process.env.DOMA_API_KEY || '',
  },
}


