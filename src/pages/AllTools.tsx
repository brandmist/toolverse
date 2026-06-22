import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Search, X, SlidersHorizontal, ArrowUpDown, Heart } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { TOOLS, CATEGORIES, Tool } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Icon } from '../components/ui/icon'
import { useStore } from '../store/useStore'

export function AllTools() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'new' | 'favorites'>('all')
  const [sortBy, setSortBy] = useState<'a-z' | 'popularity' | 'newest'>('popularity')
  const { favorites } = useStore()

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool: Tool) => {
      const matchesQuery = !query || tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !selectedCategory || tool.categoryId === selectedCategory
      let matchesType = true
      if (filterType === 'popular') matchesType = !!tool.isPopular
      if (filterType === 'new') matchesType = !!tool.isNew
      if (filterType === 'favorites') matchesType = favorites.includes(tool.id)
      return matchesQuery && matchesCategory && matchesType
    }).sort((a, b) => {
      if (sortBy === 'a-z') return a.name.localeCompare(b.name)
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
    })
  }, [query, selectedCategory, filterType, sortBy, favorites])

  const clearAll = () => { setQuery(''); setSelectedCategory(null); setFilterType('all') }
  const hasFilters = query || selectedCategory || filterType !== 'all'

  return (
    <>
      <Helmet>
        <title>All Tools — ToolVerse</title>
        <meta name="description" content="Browse 200+ free online tools for PDF, image, text, coding, and more. No sign-up. All browser-based." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* ── Page Header ── */}
        <div className="bg-white border-b border-[#E5E7EB] pt-24 pb-12">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">All Tools</p>
              <h1 className="text-[#111827] mb-4">Tool Directory</h1>
              <p className="text-[16px] text-[#6B7280] leading-relaxed">
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              <input
                id="tools-search"
                type="search"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools by name or category…"
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/8 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#374151] rounded-md hover:bg-[#F3F4F6] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Type filters */}
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by type">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
                </span>
                {(['all', 'popular', 'new', 'favorites'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${
                      filterType === type
                        ? 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#111827]'
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
                <ArrowUpDown className="w-4 h-4 text-[#9CA3AF]" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-[#E5E7EB] text-[13px] font-medium text-[#374151] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#111827] transition-colors appearance-none cursor-pointer"
                >
                  <option value="popularity">Sort: Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="a-z">Sort: A–Z</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-2.5 hide-scrollbar" role="group" aria-label="Filter by category">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                  !selectedCategory
                    ? 'bg-[#111827] text-white border-[#111827] shadow-md shadow-black/10'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFA] hover:text-[#111827]'
                }`}
              >
                <SlidersHorizontal className={`w-4 h-4 ${!selectedCategory ? 'text-white' : 'text-[#9CA3AF]'}`} /> All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#111827] text-white border-[#111827] shadow-md shadow-black/10'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFA] hover:text-[#111827]'
                  }`}
                >
                  <Icon name={cat.icon as any} className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-white' : 'text-[#9CA3AF]'}`} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Results header ── */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-[#111827]">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              {hasFilters && <span className="text-[#9CA3AF] font-normal"> found</span>}
            </h2>
            {hasFilters && (
              <button onClick={clearAll} className="text-[13px] text-[#6B7280] hover:text-[#111827] font-medium flex items-center gap-1.5 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
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
            <div className="py-24 text-center border border-[#E5E7EB] rounded-xl bg-[#FAFAFA]">
              <p className="text-[18px] font-semibold text-[#374151] mb-2">No tools found</p>
              <p className="text-[14px] text-[#6B7280] mb-6">Try adjusting your search or clearing the filters.</p>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white text-[14px] font-semibold rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
