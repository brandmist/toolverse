import { useState, useMemo } from 'react'
import { SEO } from '../components/ui/SEO'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { SearchIcon, X, SlidersHorizontal } from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { AdBanner } from '../components/ui/AdBanner'

export function Search() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesQuery = tool.name.toLowerCase().includes(query.toLowerCase()) || 
                           tool.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = selectedCategory ? tool.categoryId === selectedCategory : true
      return matchesQuery && matchesCategory
    })
  }, [query, selectedCategory])

  return (
    <>
      <SEO 
        title="Search Tools — SmarTools"
        description="Search through our curated directory of 200+ premium free tools."
        url="https://smartools.pages.dev/search"
      />
      <div className="pt-24 pb-20 max-w-[1280px] mx-auto px-6 min-h-screen bg-white">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary tracking-tight leading-tight">Find the perfect tool</h1>
        <p className="text-[16px] text-muted mb-8">Search through our curated directory of 200+ premium tools.</p>
        
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-subtle" />
          </div>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm text-[15px] placeholder:text-subtle"
            placeholder="Search for image cropper, PDF merger, case converter..."
          />
          {query && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
               <button onClick={() => setQuery('')} className="text-subtle hover:text-secondary p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                  <X className="h-4 w-4" />
               </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-subtle uppercase tracking-wider mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </div>
          <button 
            className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors border ${selectedCategory === null ? 'bg-primary text-white border-[#111827]' : 'bg-white border-border text-muted hover:border-border-hover hover:text-primary'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors border ${selectedCategory === cat.id ? 'bg-primary text-white border-[#111827]' : 'bg-white border-border text-muted hover:border-border-hover hover:text-primary'}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center w-full mt-8 mb-4">
        <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
        <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
        <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
      </div>

      <div className="mt-8 border-t border-border pt-10">
        <div className="mb-6 text-[15px] font-semibold text-primary">
          Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <div key={tool.id} className="min-h-[160px]">
                <ToolCard tool={tool} index={index} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-surface border border-border rounded-2xl">
              <div className="w-16 h-16 bg-white border border-border rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                <SearchIcon className="w-8 h-8 text-subtle" />
              </div>
              <p className="text-xl font-bold text-primary mb-2">No tools found matching your criteria</p>
              <p className="text-muted mb-6 text-[15px]">Try adjusting your search terms or filters.</p>
              <button 
                onClick={() => { setQuery(''); setSelectedCategory(null); }}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center w-full mt-12">
          <AdBanner adKey="52d14c4cfc4b28a541def0f2dbd7b118" height={250} width={300} />
        </div>
      </div>
    </div>
    </>
  )
}
