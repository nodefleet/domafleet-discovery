import { Link } from 'react-router-dom'
import { MarketCard } from '../components/MarketCard'

export function Home() {
  return (
    <section className="stack gap-lg">
      <h1>Doma Discovery Marketplace</h1>
      <p>
        Cada track se inspira en los RFPs de Doma, con ejemplos para encender ideas. Construye MVPs que impulsen actividad on-chain.
      </p>
      <div className="grid">
        <MarketCard
          title="Track 1: Subastas On-Chain y Descubrimiento de Precios"
          description="Mecanismos innovadores para dominios premium/caducados en Doma. Subastas selladas, holandesas y gamificadas para aumentar participación, txns y tarifas. Enfocado en reducir asimetrías para vendedores y compradores."
          ctaLabel="Explorar Track 1"
          onClick={() => {}}
        />
      </div>
      <div>
        <Link className="btn" to="/track-1">Ir a Track 1</Link>
      </div>
    </section>
  )
}


