import { useState } from 'react'
import { motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/tools'
import { CategoryCard } from '../components/ui/CategoryCard'
import { AdBanner } from '../components/ui/AdBanner'
import { NativeAd } from '../components/ui/NativeAd'

export function Categories() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Tool Categories - SmarTools",
    "description": "Browse our collection of 200+ free online tools by category. Find the perfect utility for your workflow.",
    "url": "https://smartools.pages.dev/categories"
  };

  return (
    <>
      <Helmet>
        <title>Tool Categories — SmarTools</title>
        <meta name="description" content="Browse 200+ free online tools organized by category: PDF, image, text, coding, color, social and more." />
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
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

        {/* ── Grid & Sidebar ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
            >
              {CATEGORIES.map((category, index) => (
                <div key={category.id} className="min-h-[180px]">
                  <CategoryCard category={category} index={index} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar Ads */}
          <div className="hidden lg:flex flex-col gap-6 shrink-0 w-[160px]">
            <AdBanner adKey="81045c2de93bfbab7c8203b44ab27f1c" height={600} width={160} className="!my-0" />
            <AdBanner adKey="345a35132c9593f18323c0c418bfe582" height={300} width={160} className="!my-0" />
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <NativeAd />
        </div>
      </div>
    </>
  )
}
