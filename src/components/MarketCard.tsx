type MarketCardProps = {
  title: string
  description: string
  ctaLabel?: string
  onClick?: () => void
}

import { motion } from 'framer-motion'

export function MarketCard({ title, description, ctaLabel = 'Ver', onClick }: MarketCardProps) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
      <div className="card-actions">
        <button onClick={onClick} className="btn">{ctaLabel}</button>
      </div>
    </motion.div>
  )
}


