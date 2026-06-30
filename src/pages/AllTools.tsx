import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Search, X, SlidersHorizontal, ArrowUpDown, Heart } from 'lucide-react'
import { SEO } from '../components/ui/SEO'
import { TOOLS, CATEGORIES, Tool } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Icon } from '../components/ui/icon'
import { useStore } from '../store/useStore'
import { AdBanner } from '../components/ui/AdBanner'
import { NativeAd } from '../components/ui/NativeAd'

export function AllTools() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'new' | 'favorites'>('all')
  const [sortBy, setSortBy] = useState<'a-z' | 'popularity' | 'newest' | 'category'>('popularity')
  const { favorites } = useStore()

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool: Tool) => {
      const lowerQuery = query.toLowerCase()
      const matchesQuery = !query || 
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        (tool.features && tool.features.some(f => f.toLowerCase().includes(lowerQuery))) ||
        (tool.useCases && tool.useCases.some(u => u.toLowerCase().includes(lowerQuery))) ||
        (tool.developer && tool.developer.toLowerCase().includes(lowerQuery))
        
      const matchesCategory = !selectedCategory || tool.categoryId === selectedCategory
      let matchesType = true
      if (filterType === 'popular') matchesType = !!tool.isPopular
      if (filterType === 'new') matchesType = !!tool.isNew
      if (filterType === 'favorites') matchesType = favorites.includes(tool.id)
      return matchesQuery && matchesCategory && matchesType
    }).sort((a, b) => {
      if (sortBy === 'a-z') return a.name.localeCompare(b.name)
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      if (sortBy === 'category') {
        const catCompare = a.categoryId.localeCompare(b.categoryId)
        return catCompare !== 0 ? catCompare : a.name.localeCompare(b.name)
      }
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
    })
  }, [query, selectedCategory, filterType, sortBy, favorites])

  const clearAll = () => { setQuery(''); setSelectedCategory(null); setFilterType('all') }
  const hasFilters = query || selectedCategory || filterType !== 'all'

  return (
    <>
      <SEO 
        title="All Tools — SmarTools"
        description="Browse 200+ free online tools for PDF, image, text, coding, and more. No sign-up. All browser-based."
        url="https://smartools.pages.dev/tools"
      />

      <div className="min-h-screen bg-white">
        {/* ── Page Header ── */}
        <div className="bg-white border-b border-border pt-24 pb-12">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">All Tools</p>
              <h1 className="text-primary mb-4">Tool Directory</h1>
              <p className="text-[16px] text-muted leading-relaxed">
                Browse our complete collection of 200+ free utilities. All browser-based, private, and instant.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-8">
          {/* ── Search & Filters ── */}
          <div className="mb-8 space-y-4">
            {/* Search input */}
            <div className="relative max-w-xl">
              <label htmlFor="tools-search" className="sr-only">Search tools</label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
              <input
                id="tools-search"
                type="search"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools by name or category…"
                className="w-full pl-10 pr-10 py-3 bg-white border border-border rounded-2xl text-[14px] text-primary placeholder-[#9CA3AF] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/8 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-subtle hover:text-secondary rounded-md hover:bg-surface-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Type filters */}
              <div className="flex items-center gap-3 flex-wrap" role="group" aria-label="Filter by type">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-subtle uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
                </span>
                {(['all', 'popular', 'new', 'favorites'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${
                      filterType === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-muted border-border hover:border-border-hover hover:text-primary'
                    }`}
                  >
                    {type === 'favorites' && <Heart className="w-3 h-3" />}
                    {type === 'all' ? 'All Tools' : type === 'popular' ? 'Popular' : type === 'new' ? 'New' : 'Favorites'}
                  </button>
                ))}
              </div>

              {/* Sort — pushed right */}
              <div className="sm:ml-auto flex items-center gap-2">
                <label htmlFor="sort-select" className="sr-only">Sort tools</label>
                <ArrowUpDown className="w-4 h-4 text-subtle" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-border text-[13px] font-medium text-secondary rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="popularity">Sort: Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="a-z">Sort: A–Z</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-3 hide-scrollbar" role="group" aria-label="Filter by category">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                  !selectedCategory
                    ? 'bg-primary text-white border-primary shadow-md shadow-black/10'
                    : 'bg-white text-muted border-border hover:border-border-hover hover:bg-surface hover:text-primary'
                }`}
              >
                <SlidersHorizontal className={`w-4 h-4 ${!selectedCategory ? 'text-white' : 'text-subtle'}`} /> All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-md shadow-black/10'
                      : 'bg-white text-muted border-border hover:border-border-hover hover:bg-surface hover:text-primary'
                  }`}
                >
                  <Icon name={cat.icon as any} className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-white' : 'text-subtle'}`} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Results header ── */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-primary">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              {hasFilters && <span className="text-subtle font-normal"> found</span>}
            </h2>
            {hasFilters && (
              <button onClick={clearAll} className="text-[13px] text-muted hover:text-primary font-medium flex items-center gap-1.5 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* Top Banner Ad */}
          <div className="w-full flex flex-col items-center justify-center my-6">
            <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
            <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
            <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
          </div>

          {/* ── Tools Grid ── */}
          {filteredTools.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredTools.map((tool, i) => (
                <div key={tool.id} className="min-h-[160px]">
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center border border-border rounded-xl bg-surface">
              <p className="text-[18px] font-semibold text-secondary mb-2">No tools found</p>
              <p className="text-[14px] text-muted mb-6">Try adjusting your search or clearing the filters.</p>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            </div>
          )}

          {/* Bottom Native Ad */}
          <div className="mt-12">
            <NativeAd />
          </div>
        </div>
      </div>
    </>
  )
}
