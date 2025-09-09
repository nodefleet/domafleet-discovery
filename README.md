# Doma Discovery Marketplace (React + Vite + TypeScript)

Proyecto base tipo marketplace inspirado en los RFPs de Doma. Incluye rutas y contenido para el Track 1: Subastas On-Chain y Descubrimiento de Precios.

## Scripts
- npm run dev: entorno de desarrollo
- npm run build: build de producción
- npm run preview: previsualización del build

## Estructura
- src/App.tsx: rutas y layout principal
- src/pages/Home.tsx: portada
- src/pages/TrackOne.tsx: contenido del Track 1
- src/components/*: componentes UI

## Notas
- No se levanta el servidor automáticamente. Ejecuta los scripts cuando lo necesites.
- Instala dependencias con npm, pnpm o yarn antes de ejecutar scripts.

### Configuración de API Key (Subgraph Doma)
- Crea un archivo `.env` en la raíz con:
  - `VITE_DOMA_API_KEY=tu_api_key`
- La clave se envía como header `x-api-key` al endpoint `https://api-testnet.doma.xyz/graphql`.
