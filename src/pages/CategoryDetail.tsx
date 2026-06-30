import { useParams, Navigate, Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { motion } from 'motion/react'
import { ArrowLeft, SlidersHorizontal, ArrowRightLeft, Settings2, Sparkles, LayoutGrid } from 'lucide-react'
import { CATEGORIES, TOOLS, Tool } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { Icon } from '../components/ui/icon'
import { useState, useMemo } from 'react'
import { ResponsiveAd } from '../components/ui/ResponsiveAd'
import React from 'react'

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
    <>
      <SEO 
        title={`${category.name} Tools — SmarTools`}
        description={category.description}
        url={`https://smartools.pages.dev/category/${category.id}`}
        schemas={[{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${category.name} Tools`,
          "description": category.description,
          "url": `https://smartools.pages.dev/category/${category.id}`
        }]}
      />
      <div className="bg-white min-h-screen">
      {/* Clean Enterprise Header */}
      <div className="pt-24 pb-12 border-b border-border bg-surface">
        <div className="max-w-[1280px] mx-auto px-6">
          <Link 
            to="/categories" 
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-14 h-14 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Icon name={category.icon} className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
                {category.name}
              </h1>
              <p className="text-[16px] text-muted max-w-2xl">
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
                    ? 'bg-primary text-white border-primary shadow-md shadow-black/10'
                    : 'bg-white text-muted border-border hover:border-border-hover hover:bg-surface hover:text-primary'
                }`}
              >
                <opt.icon className={`w-4 h-4 ${activeFilter === opt.id ? 'text-white' : 'text-subtle'}`} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-primary">
              {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} {activeFilter !== 'all' && 'found'}
            </h2>
          </div>

          {/* Top Banner Ad */}
          <div className="w-full flex flex-col items-center justify-center my-6">
            <ResponsiveAd type="horizontal" className="!my-0" />
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryTools.length > 0 ? (
              categoryTools.map((tool, index) => (
                <React.Fragment key={tool.id}>
                  <div className="min-h-[160px]">
                    <ToolCard tool={tool} index={index} />
                  </div>
                  {index > 0 && (index + 1) % 12 === 0 && (
                    <div className="col-span-full">
                      <ResponsiveAd type="horizontal" />
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-full py-24 text-center border border-border rounded-xl bg-surface">
                <p className="text-[18px] font-semibold text-secondary mb-2">No tools found</p>
                <p className="text-[14px] text-muted">We don't have any tools of this type in this category yet.</p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                  View all {category.name}
                </button>
              </div>
            )}
          </motion.div>

          {/* Bottom Native Ad */}
          <div className="mt-12">
            <ResponsiveAd type="native" className="!my-0" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
