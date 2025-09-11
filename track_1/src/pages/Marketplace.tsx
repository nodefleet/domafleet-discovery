import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchNames } from '@/services/backend'
import { motion, AnimatePresence } from 'framer-motion'

type SearchItem = {
  sld: string
  tld: string
  available: boolean
  saleType?: string
  price?: number | null
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export default function Marketplace() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])

  // Filters
  const [selectedTlds, setSelectedTlds] = useState<string[]>(['ai', 'ape', 'com', 'football', 'io', 'shib'])
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [availableForOffer, setAvailableForOffer] = useState<boolean>(false)
  const [listedForSale, setListedForSale] = useState<boolean>(true)
  const [isNew, setIsNew] = useState<boolean>(false)
  const [sortByPrice, setSortByPrice] = useState<'ASC' | 'DESC' | ''>('')
  const [sortByDate, setSortByDate] = useState<'ASC' | 'DESC' | ''>('')

  useEffect(() => { setLoading(false) }, [])

  const onSearchBySld = () => {
    const sld = query.trim()
    if (!sld) {
      setResults([])
      return
    }
    setSearching(true)
    setError(null)
    
    // Build names array for searchDomains from input
    let names: { sld: string; tld: string }[]
    if (sld.includes('.')) {
      const parts = sld.split('.')
      const tld = parts.pop()!.trim()
      const sldOnly = parts.join('.').trim()
      names = sldOnly && tld ? [{ sld: sldOnly, tld }] : []
    } else {
      names = selectedTlds.map((tld) => ({ sld, tld }))
    }
    if (names.length === 0) {
      setSearching(false)
      setError('Invalid domain input')
      return
    }

    const nameFilter = names.length === 1 ? `${names[0].sld}.${names[0].tld}` : undefined
    const tlds = nameFilter ? undefined : selectedTlds
    searchNames({ name: nameFilter, tlds, take: 48, sortOrder: sortByDate || undefined })
      .then((r) => {
        const items = r.names.items.map((n) => {
          const [sldPart, ...rest] = n.name.split('.')
          return {
            sld: sldPart,
            tld: rest.join('.'),
            available: true,
            saleType: 'PRIMARY',
            price: null,
          }
        })
        setResults(items)
      })
      .catch((e) => setError(e.message))
      .finally(() => setSearching(false))
  }

  return (
    <section className="md:min-h-screen flex flex-col items-center justify-start bg-gradient-primary gap-6 md:gap-8 pt-6 md:pt-10 px-3 md:px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-blue/5 via-transparent to-blue-300/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-light-blue/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
      
      <motion.div
        className="mb-8 md:mb-12 relative z-10 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div
          className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-light-blue/20 to-blue-300/20 border border-light-blue/30 mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <i className="fa-solid fa-globe text-light-blue mr-2"></i>
          <span className="text-light-blue text-sm font-semibold">
            Domain Discovery
          </span>
        </motion.div>

        <h1 className="text-light-blue text-3xl md:text-5xl font-bold font-orbitron mb-6 text-gradient">
          Marketplace
        </h1>

        <p className="text-blue-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Discover and explore premium domains with transparent pricing and on-chain auctions
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div 
        className="w-full max-w-4xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-blue-300"></i>
            </div>
            <input 
              className="w-full p-4 pl-10 rounded-xl bg-dark-blue/30 border-2 border-light-blue/30 text-white placeholder-blue-300 focus:border-light-blue focus:outline-none transition-all duration-300"
              placeholder="Search by domain name (e.g. example or example.com)" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchBySld()}
            />
          </div>
          <motion.button 
            className="bg-gradient-to-r from-light-blue to-blue-300 hover:from-blue-300 hover:to-light-blue text-white font-bold py-4 px-8 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden relative"
            onClick={onSearchBySld} 
            disabled={searching}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center justify-center">
              {searching ? (
                <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Searching...</>
              ) : (
                <><i className="fa-solid fa-rocket mr-2"></i> Search</>
              )}
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="w-full max-w-4xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div 
          className="relative bg-gradient-to-br from-dark-blue/70 via-dark-blue/50 to-navy-blue/70 backdrop-blur-sm border border-light-blue/30 rounded-2xl p-6 md:p-8 overflow-hidden group"
          whileHover={{
            boxShadow: "0px 10px 30px rgba(85,154,208,0.20)",
          }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-light-blue via-blue-300 to-light-blue opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <i className="fa-solid fa-filter text-light-blue mr-2"></i>
              <h3 className="text-light-blue text-lg font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TLDs */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">TLDs</label>
                <div className="flex flex-wrap gap-2">
                  {['ai','ape','com','football','io','shib'].map((tld) => (
                    <motion.label 
                      key={tld} 
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                        selectedTlds.includes(tld) 
                          ? 'bg-light-blue/20 border-light-blue/40 text-white' 
                          : 'bg-dark-blue/40 border-light-blue/10 text-blue-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedTlds.includes(tld)} 
                        onChange={(e) => {
                          setSelectedTlds((prev) => e.target.checked 
                            ? [...prev, tld] 
                            : prev.filter((x) => x !== tld))
                        }} 
                      />
                      <i className={`fa-${selectedTlds.includes(tld) ? 'solid' : 'regular'} fa-circle-check mr-1 text-xs`}></i>
                      .{tld}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-dollar-sign text-blue-300/70 text-sm"></i>
                    </div>
                    <input 
                      className="w-full p-2 pl-8 rounded-lg bg-dark-blue/30 border border-light-blue/30 text-white placeholder-blue-300/70 focus:border-light-blue focus:outline-none transition-all duration-300"
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                    />
                  </div>
                  <span className="text-blue-300">-</span>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-dollar-sign text-blue-300/70 text-sm"></i>
                    </div>
                    <input 
                      className="w-full p-2 pl-8 rounded-lg bg-dark-blue/30 border border-light-blue/30 text-white placeholder-blue-300/70 focus:border-light-blue focus:outline-none transition-all duration-300"
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Options</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors duration-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 rounded border-light-blue/30 text-light-blue focus:ring-light-blue bg-dark-blue/30" 
                      checked={availableForOffer} 
                      onChange={(e) => setAvailableForOffer(e.target.checked)} 
                    />
                    <span>Available for offer</span>
                  </label>
                  <label className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors duration-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 rounded border-light-blue/30 text-light-blue focus:ring-light-blue bg-dark-blue/30" 
                      checked={listedForSale} 
                      onChange={(e) => setListedForSale(e.target.checked)} 
                    />
                    <span>Listed for sale</span>
                  </label>
                  <label className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors duration-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 rounded border-light-blue/30 text-light-blue focus:ring-light-blue bg-dark-blue/30" 
                      checked={isNew} 
                      onChange={(e) => setIsNew(e.target.checked)} 
                    />
                    <span>New listings</span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Sort By</label>
                <div className="flex items-center gap-3">
                  <select 
                    className="flex-1 p-2 rounded-lg bg-dark-blue/30 border border-light-blue/30 text-white focus:border-light-blue focus:outline-none transition-all duration-300"
                    value={sortByPrice} 
                    onChange={(e) => setSortByPrice(e.target.value as any)}
                  >
                    <option value="">Sort by price</option>
                    <option value="ASC">Price: Low to High</option>
                    <option value="DESC">Price: High to Low</option>
                  </select>
                  <select 
                    className="flex-1 p-2 rounded-lg bg-dark-blue/30 border border-light-blue/30 text-white focus:border-light-blue focus:outline-none transition-all duration-300"
                    value={sortByDate} 
                    onChange={(e) => setSortByDate(e.target.value as any)}
                  >
                    <option value="">Sort by date</option>
                    <option value="ASC">Date: Oldest first</option>
                    <option value="DESC">Date: Newest first</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="w-full max-w-4xl mx-auto text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <i className="fa-solid fa-circle-notch text-light-blue text-4xl"></i>
            </motion.div>
            <p className="text-blue-300 mt-4">Loading domains...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-red-500/20 border border-red-500/40 text-white rounded-xl p-4 flex items-center">
              <i className="fa-solid fa-circle-exclamation text-red-400 mr-3 text-xl"></i>
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            className="w-full max-w-4xl mx-auto relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <i className="fa-solid fa-list text-light-blue mr-3"></i>
                <h2 className="text-white text-xl font-bold">Search Results</h2>
              </div>
              <span className="text-blue-300 text-sm">{results.length} domains found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((it, idx) => (
                <motion.div 
                  key={idx} 
                  className="relative group bg-gradient-to-br from-dark-blue/70 via-dark-blue/50 to-navy-blue/70 backdrop-blur-sm border border-light-blue/20 rounded-2xl p-5 overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: "0px 25px 50px 0px rgba(85,154,208,0.30)",
                    borderColor: "rgba(85,154,208,0.4)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate(`/name/${encodeURIComponent(`${it.sld}.${it.tld}`)}`)}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-light-blue via-blue-300 to-light-blue opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-light-blue transition-colors duration-300">
                        {it.sld}.{it.tld}
                      </h3>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        it.available 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {it.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-300 text-sm mb-4">
                      <i className="fa-solid fa-tag mr-2"></i>
                      <span>{it.price != null ? `${Number(it.price).toLocaleString()} USD` : 'Price on request'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-blue-300/70">
                        {it.saleType || 'PRIMARY'}
                      </div>
                      <motion.button 
                        className="text-light-blue hover:text-white text-sm flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                        <i className="fa-solid fa-arrow-right ml-1"></i>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results State */}
      <AnimatePresence>
        {!loading && !error && query && results.length === 0 && (
          <motion.div 
            className="w-full max-w-4xl mx-auto text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <i className="fa-solid fa-search text-light-blue text-4xl mb-4 block"></i>
            <h3 className="text-white text-xl font-bold mb-2">No domains found</h3>
            <p className="text-blue-300">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <motion.div 
        className="w-full max-w-4xl mx-auto mt-12 mb-8 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative bg-gradient-to-br from-dark-blue/60 via-dark-blue/40 to-navy-blue/60 backdrop-blur-sm border border-light-blue/30 rounded-2xl p-8 md:p-12 overflow-hidden group">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-light-blue/5 via-transparent to-blue-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-light-blue via-blue-300 to-light-blue opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 text-center">
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-light-blue/20 to-blue-300/20 border border-light-blue/30 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <i className="fa-solid fa-rocket text-light-blue mr-2"></i>
              <span className="text-light-blue font-semibold">
                On-Chain Auctions
              </span>
            </motion.div>

            <h3 className="text-white text-2xl md:text-3xl font-bold font-orbitron mb-4 text-gradient">
              Discover Premium Domains
            </h3>

            <p className="text-blue-300 mb-8 max-w-2xl mx-auto">
              Explore our marketplace for premium domains with transparent pricing and on-chain auctions
            </p>

            <motion.button
              className="inline-flex items-center bg-gradient-to-r from-light-blue to-blue-300 hover:from-blue-300 hover:to-light-blue text-white font-semibold py-4 px-8 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden group/btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              <i className="fa-solid fa-globe mr-2 relative z-10"></i>
              <span className="relative z-10">Browse All Domains</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}