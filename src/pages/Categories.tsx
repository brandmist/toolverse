import { motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import { CATEGORIES } from '../data/tools'
import { CategoryCard } from '../components/ui/CategoryCard'

export function Categories() {
  return (
    <>
      <Helmet>
        <title>Tool Categories — ToolVerse</title>
        <meta name="description" content="Browse 200+ free online tools organized by category: PDF, image, text, coding, color, social and more." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* ── Page Header ── */}
        <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-[13px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">Browse Directory</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6">Tool Categories</h1>
            <p className="text-lg text-[#4B5563] leading-relaxed">
              Find the perfect tool for your workflow. Organized by category for quick discovery.
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {CATEGORIES.map((category, index) => (
              <div key={category.id} className="min-h-[180px]">
                <CategoryCard category={category} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}
