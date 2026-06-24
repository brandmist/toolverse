import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, SlidersHorizontal, ArrowRightLeft, Settings2, Sparkles, LayoutGrid } from 'lucide-react'
import { CATEGORIES, TOOLS, Tool } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Icon } from '../components/ui/icon'
import { useState, useMemo } from 'react'
import { AdBanner } from '../components/ui/AdBanner'
import { NativeAd } from '../components/ui/NativeAd'

const getToolType = (tool: Tool) => {
  const n = tool.name.toLowerCase()
  const id = tool.id.toLowerCase()
  
  if (n.includes(' to ') || n.includes('converter') || id.includes('-to-')) return 'converters'
  
  if (n.includes('generator') || n.includes('maker') || n.includes('creator') || n.includes('extract') || n.includes('builder') || n.includes('generate') || n.includes('parser') || n.includes('calculator')) return 'generators'
  
  if (n.includes('remove') || n.includes('compress') || n.includes('watermark') || n.includes('filter') || n.includes('edit') || n.includes('resize') || n.includes('crop') || n.includes('format') || n.includes('clean') || n.includes('unblur') || n.includes('optimizer') || n.includes('split') || n.includes('merge') || n.includes('combine')) return 'editors'
  
  return 'others'
}

export function CategoryDetail() {
  const { id } = useParams()
  const [activeFilter, setActiveFilter] = useState('all')
  
  const category = CATEGORIES.find(c => c.id === id)
  
  if (!category) {
    return <Navigate to="/categories" replace />
  }

  const categoryTools = useMemo(() => {
    const tools = TOOLS.filter(t => t.categoryId === category.id)
    if (activeFilter === 'all') return tools
    return tools.filter(t => getToolType(t) === activeFilter)
  }, [category.id, activeFilter])
  
  const FILTER_OPTIONS = [
    { id: 'all', label: 'All Tools', icon: LayoutGrid },
    { id: 'converters', label: 'Converters', icon: ArrowRightLeft },
    { id: 'generators', label: 'Generators', icon: Sparkles },
    { id: 'editors', label: 'Editors & Filters', icon: Settings2 },
    { id: 'others', label: 'Others', icon: SlidersHorizontal },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Clean Enterprise Header */}
      <div className="pt-24 pb-12 border-b border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="max-w-[1280px] mx-auto px-6">
          <Link 
            to="/categories" 
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-14 h-14 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Icon name={category.icon} className="w-7 h-7 text-[#111827]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
                {category.name}
              </h1>
              <p className="text-[16px] text-[#4B5563] max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Filters & Tools Grid */}
      <div className="py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          
          {/* ── Sub-category Filter Bar ── */}
          <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-3 mb-10 hide-scrollbar" role="group" aria-label="Filter tools">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                aria-pressed={activeFilter === opt.id}
                className={`shrink-0 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                  activeFilter === opt.id
                    ? 'bg-[#111827] text-white border-[#111827] shadow-md shadow-black/10'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFA] hover:text-[#111827]'
                }`}
              >
                <opt.icon className={`w-4 h-4 ${activeFilter === opt.id ? 'text-white' : 'text-[#9CA3AF]'}`} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-[#111827]">
              {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} {activeFilter !== 'all' && 'found'}
            </h2>
          </div>

          {/* Top Banner Ad */}
          <div className="w-full flex flex-col items-center justify-center my-6">
            <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
            <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
            <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryTools.length > 0 ? (
              categoryTools.map((tool, index) => (
                <div key={tool.id} className="min-h-[160px]">
                  <ToolCard tool={tool} index={index} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center border border-[#E5E7EB] rounded-xl bg-[#FAFAFA]">
                <p className="text-[18px] font-semibold text-[#374151] mb-2">No tools found</p>
                <p className="text-[14px] text-[#6B7280]">We don't have any tools of this type in this category yet.</p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-[#111827] text-white text-[14px] font-semibold rounded-lg hover:bg-[#1F2937] transition-colors"
                >
                  View all {category.name}
                </button>
              </div>
            )}
          </motion.div>

          {/* Bottom Native Ad */}
          <div className="mt-12">
            <NativeAd />
          </div>
        </div>
      </div>
    </div>
  )
}
