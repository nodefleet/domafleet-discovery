import { useEffect, useState } from 'react'
import { getDomainListingsBySld } from '@/services/doma'

type SldListingItem = {
  price: string | number
  currency: string
  seller: string
  createdAt: string
}

export default function Marketplace() {
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sldItems, setSldItems] = useState<SldListingItem[]>([])

  useEffect(() => { setLoading(false) }, [])

  const onSearchBySld = () => {
    const sld = query.trim()
    if (!sld) {
      setSldItems([])
      return
    }
    setSearching(true)
    setError(null)
    getDomainListingsBySld(sld)
      .then((r) => setSldItems(r.listings.items))
      .catch((e) => setError(e.message))
      .finally(() => setSearching(false))
  }

  return (
    <section className="stack gap-lg">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <div className="flex gap-2">
        <input className="w-full p-2 rounded bg-transparent border border-[color:var(--border)]" placeholder="Buscar listados por SLD (ej: example)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" onClick={onSearchBySld} disabled={searching}>{searching ? 'Buscando...' : 'Buscar'}</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {sldItems.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-2">Resultados por SLD</h3>
          <ul className="text-sm opacity-90">
            {sldItems.map((it, idx) => (
              <li key={idx} className="py-1 border-b border-[color:var(--border)] last:border-0">
                <div className="flex flex-col">
                  <span>{Number(it.price).toLocaleString()} {it.currency}</span>
                  <span className="opacity-70">Vendedor: {it.seller}</span>
                  <span className="opacity-70">Creado: {new Date(it.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}


