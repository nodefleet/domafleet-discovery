import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDomain, getDomainActivities } from '@/services/backend'

export default function NameDetail() {
  const { name } = useParams()
  type UiDsKey = { algorithm?: string; digestType?: string; keyTag?: number | string }
  type UiFractional = {
    address?: string
    status?: string
    chain?: { name?: string; networkId?: number | string }
    poolAddress?: string
    launchpadAddress?: string
  }
  const [data, setData] = useState<
    | {
      claimedBy?: string
      name: string
      eoi?: string | number
      expiresAt?: string
      tokenizedAt?: string
      isFractionalized?: boolean
      dsKeys?: UiDsKey[]
      fractionalTokenInfo?: UiFractional | null
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
    getDomain(name)
      .then((r) => { if (mounted) setData(r.name as any) })
      .catch((e) => setError(e.message))
    getDomainActivities(name, 20)
      .then((r) => { if (mounted) setActivities(r.nameActivities.items as any) })
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
          <p><span className="opacity-70">Reclamado por:</span> {data.claimedBy || '—'}</p>
          <p><span className="opacity-70">EOI:</span> {data.eoi != null ? String(data.eoi) : '—'}</p>
          <p><span className="opacity-70">Expira:</span> {data.expiresAt ? new Date(data.expiresAt).toLocaleString() : '—'}</p>
          <p><span className="opacity-70">Tokenizado:</span> {data.tokenizedAt ? new Date(data.tokenizedAt).toLocaleString() : '—'}</p>
          <p><span className="opacity-70">Fraccionalizado:</span> {data.isFractionalized ? 'Sí' : 'No'}</p>
          <p className="col-span-full"><span className="opacity-70">DS Keys:</span> {data.dsKeys?.length ?? 0}</p>
        </div>
      </div>

      {data.dsKeys && data.dsKeys.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-2">DS Keys</h3>
          <ul className="text-sm opacity-90">
            {data.dsKeys.map((k, idx) => (
              <li key={idx} className="py-1 border-b border-[color:var(--border)] last:border-0">
                <div className="flex flex-col gap-0.5">
                  <span>KeyTag: {k.keyTag ?? '—'}</span>
                  <span className="opacity-70">{k.algorithm || '—'} / {k.digestType || '—'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.fractionalTokenInfo && (
        <div className="card">
          <h3 className="font-semibold mb-2">Token fraccional</h3>
          <div className="text-sm opacity-90 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><span className="opacity-70">Dirección:</span> {data.fractionalTokenInfo.address || '—'}</p>
            <p><span className="opacity-70">Estado:</span> {data.fractionalTokenInfo.status || '—'}</p>
            <p><span className="opacity-70">Cadena:</span> {data.fractionalTokenInfo.chain?.name || '—'}</p>
            <p><span className="opacity-70">Network ID:</span> {data.fractionalTokenInfo.chain?.networkId ?? '—'}</p>
            <p><span className="opacity-70">Pool:</span> {data.fractionalTokenInfo.poolAddress || '—'}</p>
            <p><span className="opacity-70">Launchpad:</span> {data.fractionalTokenInfo.launchpadAddress || '—'}</p>
          </div>
        </div>
      )}

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


