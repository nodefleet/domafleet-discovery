Backend DOMA (Node.js + TypeScript)

Requisitos
- Node.js 18+

Variables de entorno
- DOMA_GRAPHQL_ENDPOINT: URL del endpoint GraphQL (ej: https://api-testnet.doma.xyz/graphql)
- DOMA_API_KEY: API key de DOMA
- PORT: Puerto HTTP (por defecto 4001)

Scripts
- dev: Ejecuta el servidor en desarrollo con ts-node-dev
- build: Transpila TypeScript a dist/
- start: Ejecuta desde dist/

Endpoints
- GET /health
- POST /api/doma/graphql
- GET /api/domains/:name
- GET /api/domains/:name/activities?take=50
- GET /api/market/metrics?tld=near
- POST /api/market/recommendations
- GET /api/offers?tokenId=...


