import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { SearchIcon, X, SlidersHorizontal } from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'

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
    <div className="pt-24 pb-20 max-w-[1280px] mx-auto px-6 min-h-screen bg-white">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#111827] tracking-tight leading-tight">Find the perfect tool</h1>
        <p className="text-[16px] text-[#6B7280] mb-8">Search through our curated directory of 200+ premium tools.</p>
        
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 shadow-sm text-[15px] placeholder:text-[#9CA3AF]"
            placeholder="Search for image cropper, PDF merger, case converter..."
          />
          {query && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
               <button onClick={() => setQuery('')} className="text-[#9CA3AF] hover:text-[#374151] p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                  <X className="h-4 w-4" />
               </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wider mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </div>
          <button 
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${selectedCategory === null ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#111827]'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${selectedCategory === cat.id ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#111827]'}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-[#E5E7EB] pt-10">
        <div className="mb-6 text-[15px] font-semibold text-[#111827]">
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
            <div className="col-span-full py-24 text-center bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl">
              <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                <SearchIcon className="w-8 h-8 text-[#9CA3AF]" />
              </div>
              <p className="text-xl font-bold text-[#111827] mb-2">No tools found matching your criteria</p>
              <p className="text-[#6B7280] mb-6 text-[15px]">Try adjusting your search terms or filters.</p>
              <button 
                onClick={() => { setQuery(''); setSelectedCategory(null); }}
                className="px-6 py-3 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1F2937] transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
