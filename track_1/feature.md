# Track 1: On-Chain Auctions & Price Discovery

## Descripción
Innovar en mecanismos de subastas para dominios premium/expirados en Doma, habilitando descubrimiento de precios transparente con estrategias personalizadas (ej. subastas gamificadas/Dutch) para impulsar participación, transacciones y comisiones. Enfoque en reducir asimetría para vendedores/compradores.

## Premio
$10,000 USDC + elegibilidad para fast-track de Doma Forge.

## Ejemplos de Construcción
- Una dApp para auto-listing de dominios expirados con ofertas selladas y notificaciones en tiempo real
- Herramienta de subasta gamificada usando oráculos de Doma para reservas dinámicas
- Marketplace optimizado en comisiones con liquidaciones on-chain y transferencias web2

## Queries GraphQL Disponibles

### Obtener información del dominio
```graphql
query GetDomainInfo($name: String!) {
  name(name: $name) {
    id
    name
    tokenId
    owner
    isActive
    isListed
    price { amount, currency, usdValue }
  }
}
```

### Obtener actividades recientes
```graphql
query GetDomainActivities($name: String!, $take: Int!) {
  nameActivities(name: $name, take: $take, sortOrder: DESC) {
    items {
      type
      timestamp
      transactionHash
      value
    }
  }
}
```

### Obtener listados
```graphql
query GetDomainListings($sld: String!) {
  listings(sld: $sld, take: 10) {
    items {
      price
      currency
      seller
      createdAt
    }
  }
}
```

## Objetivos del Proyecto
- Implementar mecanismos de subasta innovadores
- Crear descubrimiento de precios transparente
- Desarrollar estrategias de subasta personalizadas
- Reducir asimetría de información entre vendedores y compradores
- Aumentar participación y volumen de transacciones
- Optimizar comisiones y liquidaciones
