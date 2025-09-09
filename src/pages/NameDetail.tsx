import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getName, getNameActivities, getOffers } from '@/services/doma'

function SealedBidForm() {
  const [amount, setAmount] = useState('')
  const [secret, setSecret] = useState('')
  return (
    <div className="card space-y-3">
      <h3 className="font-semibold">Oferta sellada</h3>
      <input className="w-full p-2 rounded bg-transparent border border-[color:var(--border)]" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input className="w-full p-2 rounded bg-transparent border border-[color:var(--border)]" placeholder="Secreto (hash)" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <button className="btn w-fit">Enviar oferta</button>
    </div>
  )
}

function DutchAuctionWidget() {
  const start = 1000
  const end = 200
  const durationMs = 10 * 60 * 1000
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const price = useMemo(() => {
    const elapsed = (now % durationMs)
    const progress = elapsed / durationMs
    return Math.max(end, Math.round(start - (start - end) * progress))
  }, [now])
  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Subasta holandesa (demo)</h3>
      <p className="text-sm opacity-90">Precio actual: {price} USDC</p>
      <button className="btn w-fit">Comprar al precio actual</button>
    </div>
  )
}

export default function NameDetail() {
  const { name } = useParams()
  const [data, setData] = useState<any | null>(null)
  const [activities, setActivities] = useState<{ type: string; createdAt: string }[]>([])
  const [offers, setOffers] = useState<{ id: string; price: string; status: string; createdAt: string; expiresAt: string; currency?: { symbol: string } }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return
    let mounted = true
    getName(name).then((r) => { if (mounted) setData(r.name) }).catch((e) => setError(e.message))
    getNameActivities(name, { take: 20 }).then((r) => { if (mounted) setActivities(r.nameActivities.items) }).catch(() => {})
    return () => { mounted = false }
  }, [name])

  useEffect(() => {
    if (!data?.tokens?.[0]?.tokenId) return
    let mounted = true
    let t: any
    const load = () => getOffers({ tokenId: data.tokens[0].tokenId, take: 10 }).then((r) => {
      if (!mounted) return
      setOffers(r.offers.items)
    }).catch(() => {})
    load()
    t = setInterval(load, 15_000)
    return () => { mounted = false; clearInterval(t) }
  }, [data?.tokens])

  if (error) return <p className="text-red-400">{error}</p>
  if (!data) return <p>Cargando...</p>

  return (
    <section className="stack gap-lg">
      <div className="stack">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <p className="text-sm opacity-80">Expira: {new Date(data.expiresAt).toLocaleString()}</p>
      </div>

      <div className="grid">
        <SealedBidForm />
        <DutchAuctionWidget />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Actividad reciente</h3>
        <ul className="text-sm opacity-90">
          {activities.map((a, idx) => (
            <li key={idx} className="py-1 border-b border-[color:var(--border)] last:border-0">
              {a.type} — {new Date(a.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Ofertas</h3>
        <ul className="text-sm opacity-90">
          {offers.map((o) => (
            <li key={o.id} className="py-1 border-b border-[color:var(--border)] last:border-0">
              {Number(o.price).toLocaleString()} {o.currency?.symbol ?? ''} — {o.status} — {new Date(o.createdAt).toLocaleString()}
            </li>
          ))}
          {offers.length === 0 && <li className="opacity-70">Sin ofertas</li>}
        </ul>
      </div>
    </section>
  )
}


