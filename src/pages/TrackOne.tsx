import { motion } from 'framer-motion'

export function TrackOne() {
  return (
    <section className="stack gap-lg">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        Track 1: Subastas On-Chain y Descubrimiento de Precios
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        Descripción: Mecanismos de subasta innovadores para dominios premium/que caducan en Doma, permitiendo un descubrimiento de precios transparente con estrategias personalizadas (p. ej., ofertas gamificadas/holandesas) para aumentar la participación, las transacciones y las tarifas. Enfócate en reducir la asimetría para vendedores y compradores.
      </motion.p>
      <ul className="bullets">
        <li><strong>Premio</strong>: $10,000 USDC + elegibilidad para la vía rápida de Doma Forge.</li>
        <li><strong>Compilaciones de ejemplo</strong>: dApp para listar dominios que caducan con ofertas selladas y notificaciones en tiempo real; herramienta de subasta gamificada usando oráculos de Doma para reservas dinámicas; marketplace optimizado para tarifas con liquidaciones on-chain y transferencias Web2.</li>
      </ul>

      <section className="stack">
        <h2>Ideas de MVP</h2>
        <div className="grid">
          <motion.article className="card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3>Listado automático de dominios que caducan</h3>
            <p>Escanea dominios próximos a expirar y crea subastas con ofertas selladas. Push/WS para alertas en tiempo real.</p>
          </motion.article>
          <motion.article className="card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3>Subasta holandesa gamificada</h3>
            <p>Usa oráculos de Doma para reservas dinámicas. Bonos por puja temprana, penalties anti-sniping.</p>
          </motion.article>
          <motion.article className="card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3>Mercado con liquidaciones on-chain</h3>
            <p>Optimiza tarifas, integra transferencias Web2 y custodia opcional. Enfoque UX para reducir fricción.</p>
          </motion.article>
        </div>
      </section>
    </section>
  )
}


