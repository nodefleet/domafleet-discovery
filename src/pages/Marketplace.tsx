import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getListings } from '@/services/doma'

type ListingItem = {
  id: string
  name: string
  price: string
  createdAt: string
  expiresAt: string
  currency: { symbol: string }
}

export default function Marketplace() {
  const [items, setItems] = useState<ListingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getListings({ take: 12, skip: page * 12 }).then((r) => {
      if (!mounted) return
      setItems(page === 0 ? r.listings.items : [...items, ...r.listings.items])
      setHasNext(Boolean(r.listings.hasNextPage))
      setLoading(false)
    }).catch((e) => {
      if (!mounted) return
      setError(e.message)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [page])

  return (
    <section className="stack gap-lg">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <div className="flex gap-2">
        <input className="w-full p-2 rounded bg-transparent border border-[color:var(--border)]" placeholder="Buscar por SLD (demo UI)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" onClick={() => setPage(0)}>Buscar</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid">
        {items.map((it) => (
          <Link key={it.id} to={`/name/${encodeURIComponent(it.name)}`} className="card hover:brightness-110 transition">
            <h3 className="font-semibold">{it.name}</h3>
            <p className="text-sm opacity-90">{Number(it.price).toLocaleString()} {it.currency?.symbol ?? ''}</p>
            <p className="text-xs opacity-60">Creado: {new Date(it.createdAt).toLocaleString()}</p>
          </Link>
        ))}
      </div>
      {hasNext && (
        <div>
          <button className="btn" disabled={loading} onClick={() => setPage((p) => p + 1)}>
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </section>
  )
}


