import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { getDomain, getDomainActivities, getListingByName, createAuction } from '@/services/backend'
import { addToCart } from '@/services/cart'
import { flyToCart } from '@/services/flyToCart'

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
  const [showPurchase, setShowPurchase] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState<null | { txId: string }>(null)
  const NODEFLEET_URL = 'https://nodefleet.xyz'
  const [buyNow, setBuyNow] = useState<null | { price: string; symbol?: string }>(null)

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 18 } },
    exit: { opacity: 0, y: 10, scale: 0.98 },
  }

  function simulatePurchase() {
    setProcessing(true)
    setSuccess(null)
    // Simulate async purchase
    setTimeout(() => {
      setProcessing(false)
      setSuccess({ txId: Math.random().toString(36).slice(2, 10) })
      // Redirect to NodeFleet after success
      setTimeout(() => {
        try {
          window.open(NODEFLEET_URL, '_blank')
        } catch {}
      }, 600)
    }, 1200)
  }

  useEffect(() => {
    if (!name) return
    let mounted = true
    getDomain(name)
      .then((r) => { if (mounted) setData(r.name as any) })
      .catch((e) => setError(e.message))
    getDomainActivities(name, 20)
      .then((r) => { if (mounted) setActivities(r.nameActivities.items as any) })
      .catch(() => { })
    getListingByName(name)
      .then((r) => {
        const item = r?.listings?.items?.[0]
        if (mounted && item?.price) setBuyNow({ price: item.price, symbol: item?.currency?.symbol })
      })
      .catch(() => { })
    return () => { mounted = false }
  }, [name])

  if (error) return <p className="text-red-400">{error}</p>
  if (!data) return <p>Loading...</p>

  return (
    <section className="stack gap-lg relative">
      <div className="stack">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <motion.button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-light-blue to-blue-300 text-white font-semibold hover:from-blue-300 hover:to-light-blue transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPurchase(true)}
          >
            <i className="fa-solid fa-credit-card"></i>
            Simulate Purchase
          </motion.button>
        </div>
        <div className="text-sm opacity-90 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><span className="opacity-70">Claimed by:</span> {data.claimedBy || '—'}</p>
          <p><span className="opacity-70">EOI:</span> {data.eoi != null ? String(data.eoi) : '—'}</p>
          <p><span className="opacity-70">Expires at:</span> {data.expiresAt ? new Date(data.expiresAt).toLocaleString() : '—'}</p>
          <p><span className="opacity-70">Tokenized at:</span> {data.tokenizedAt ? new Date(data.tokenizedAt).toLocaleString() : '—'}</p>
          <p><span className="opacity-70">Fractionalized:</span> {data.isFractionalized ? 'Yes' : 'No'}</p>
          <p className="col-span-full"><span className="opacity-70">DS Keys:</span> {data.dsKeys?.length ?? 0}</p>
          {buyNow && (
            <p className="col-span-full"><span className="opacity-70">Buy Now Price:</span> {Number(buyNow.price).toLocaleString()} {buyNow.symbol || ''}</p>
          )}
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
          <h3 className="font-semibold mb-2">Fractional token</h3>
          <div className="text-sm opacity-90 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><span className="opacity-70">Address:</span> {data.fractionalTokenInfo.address || '—'}</p>
            <p><span className="opacity-70">Status:</span> {data.fractionalTokenInfo.status || '—'}</p>
            <p><span className="opacity-70">Chain:</span> {data.fractionalTokenInfo.chain?.name || '—'}</p>
            <p><span className="opacity-70">Network ID:</span> {data.fractionalTokenInfo.chain?.networkId ?? '—'}</p>
            <p><span className="opacity-70">Pool:</span> {data.fractionalTokenInfo.poolAddress || '—'}</p>
            <p><span className="opacity-70">Launchpad:</span> {data.fractionalTokenInfo.launchpadAddress || '—'}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold mb-2">Recent activity</h3>
        <ul className="text-sm opacity-90">
          {activities.map((a, idx) => (
            <li key={idx} className="py-1 border-b border-[color:var(--border)] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span>{a.type} — {new Date(a.timestamp).toLocaleString()}</span>
                <span className="opacity-70">
                  {a.transactionHash ? `Tx: ${a.transactionHash.slice(0, 10)}…` : ''}
                  {a.value != null ? `  •  Value: ${a.value}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Simulate Purchase Modal */}
      <AnimatePresence>
        {showPurchase && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => !processing && setShowPurchase(false)}></div>
            <motion.div className="relative w-full max-w-md rounded-2xl border border-light-blue/30 bg-gradient-to-br from-dark-blue/70 via-dark-blue/50 to-navy-blue/70 p-6 text-white"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-cart-shopping text-light-blue"></i>
                  <h3 className="text-lg font-semibold">Checkout</h3>
                </div>
                <button className="text-blue-300 hover:text-white" onClick={() => !processing && setShowPurchase(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Cart only */}
              <div className="rounded-xl border border-light-blue/20 bg-dark-blue/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-basket-shopping text-light-blue"></i>
                  <span className="font-semibold">Cart</span>
                </div>
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center justify-between"><span>Domain</span><span className="text-white">{data.name}</span></div>
                  <div className="flex items-center justify-between"><span>Type</span><span className="text-white">{data.isFractionalized ? 'Secondary' : 'Primary'}</span></div>
                  <div className="flex items-center justify-between"><span>1st year</span><span className="text-white">Price on request</span></div>
                  <div className="flex items-center justify-between"><span>Renews</span><span className="text-white">—</span></div>
                  <div className="h-px bg-light-blue/20 my-2"></div>
                  <div className="flex items-center justify-between font-semibold"><span>Total</span><span className="text-white">Price on request</span></div>
                  <button
                    className="w-full mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-light-blue to-blue-300 text-white font-semibold"
                    onClick={(e) => {
                      addToCart({ name: data.name, type: data.isFractionalized ? 'SECONDARY' : 'PRIMARY', price: buyNow?.price ?? null, currency: buyNow?.symbol ?? null, addedAt: Date.now() })
                      flyToCart(e.currentTarget as unknown as HTMLElement)
                    }}
                  >
                    <i className="fa-solid fa-cart-plus mr-2"></i>
                    Add to cart
                  </button>
                </div>
              </div>

              {/* Auction action (simulated) */}
              <div className="mt-4 rounded-xl border border-light-blue/20 bg-dark-blue/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-gavel text-light-blue"></i>
                  <span className="font-semibold">Auction</span>
                </div>
                <p className="text-blue-300 text-sm mb-3">Start a simulated 24h English auction for this domain.</p>
                <button
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-light-blue to-blue-300 text-white font-semibold disabled:opacity-50"
                  disabled={processing}
                  onClick={async () => {
                    try {
                      setProcessing(true)
                      await createAuction({
                        name: data.name,
                        startingPrice: buyNow?.price ? Number(buyNow.price) : 10,
                        minIncrement: 1,
                        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                      })
                      setSuccess({ txId: Math.random().toString(36).slice(2, 10) })
                    } catch { }
                    finally { setProcessing(false) }
                  }}
                >
                  <i className="fa-solid fa-flag-checkered mr-2"></i>
                  Start Auction
                </button>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button className="px-4 py-2 rounded-lg border border-light-blue/40 text-blue-200 hover:text-white hover:border-light-blue/60 disabled:opacity-50" disabled={processing} onClick={() => setShowPurchase(false)}>Cancel</button>
                <motion.button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-light-blue to-blue-300 text-white font-semibold disabled:opacity-50"
                  whileHover={{ scale: processing ? 1 : 1.03 }}
                  whileTap={{ scale: processing ? 1 : 0.97 }}
                  onClick={simulatePurchase}
                  disabled={processing}
                >
                  {processing ? (<><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>) : (<><i className="fa-solid fa-check"></i> Confirm</>)}
                </motion.button>
              </div>

              {success && (
                <motion.div className="mt-4 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-green-300"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Purchase simulated successfully. Tx: {success.txId}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}


