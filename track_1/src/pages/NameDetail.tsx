import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDomainInfo, getDomainActivities2 } from '@/services/doma'

export default function NameDetail() {
  const { name } = useParams()
  const [data, setData] = useState<
    | {
      id: string
      name: string
      tokenId?: string
      owner?: string
      isActive?: boolean
      isListed?: boolean
      price?: { amount?: number; currency?: string; usdValue?: number }
    }
    | null
  >(null)
  const [activities, setActivities] = useState<
    { type: string; timestamp: string; transactionHash?: string; value?: string | number }[]
  >([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return
    let mounted = true
    getDomainInfo(name)
      .then((r) => {
        if (mounted) setData(r.name)
      })
      .catch((e) => setError(e.message))
    getDomainActivities2(name, 20)
      .then((r) => {
        if (mounted) setActivities(r.nameActivities.items)
      })
      .catch(() => { })
    return () => { mounted = false }
  }, [name])

  if (error) return <p className="text-red-400">{error}</p>
  if (!data) return <p>Cargando...</p>

  return (
    <section className="stack gap-lg">
      <div className="stack">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <div className="text-sm opacity-90 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><span className="opacity-70">Owner:</span> {data.owner || '—'}</p>
          <p><span className="opacity-70">Token ID:</span> {data.tokenId || '—'}</p>
          <p><span className="opacity-70">Activo:</span> {data.isActive ? 'Sí' : 'No'}</p>
          <p><span className="opacity-70">Listado:</span> {data.isListed ? 'Sí' : 'No'}</p>
          <p className="col-span-full">
            <span className="opacity-70">Precio:</span>{' '}
            {data.price?.amount != null ? Number(data.price.amount).toLocaleString() : '—'}{' '}
            {data.price?.currency || ''}
            {data.price?.usdValue != null && (
              <span className="opacity-70"> ({Number(data.price.usdValue).toLocaleString()} USD)</span>
            )}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Actividad reciente</h3>
        <ul className="text-sm opacity-90">
          {activities.map((a, idx) => (
            <li key={idx} className="py-1 border-b border-[color:var(--border)] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span>{a.type} — {new Date(a.timestamp).toLocaleString()}</span>
                <span className="opacity-70">
                  {a.transactionHash ? `Tx: ${a.transactionHash.slice(0, 10)}…` : ''}
                  {a.value != null ? `  •  Valor: ${a.value}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


