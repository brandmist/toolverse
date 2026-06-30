import { useState } from 'react'
import { motion } from 'motion/react'
import { SEO } from '../components/ui/SEO'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/tools'
import { CategoryCard } from '../components/ui/CategoryCard'
import { ResponsiveAd } from '../components/ui/ResponsiveAd'

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
      <SEO 
        title="Tool Categories — SmarTools"
        description="Browse 200+ free online tools organized by category: PDF, image, text, coding, color, social and more."
        url="https://smartools.pages.dev/categories"
        schemas={[collectionSchema]}
      />

      <div className="min-h-screen bg-white">
        {/* ── Page Header ── */}
        <div className="bg-surface border-b border-border pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-[13px] font-bold text-muted uppercase tracking-wider mb-4">Browse Directory</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-6">Tool Categories</h1>
            <p className="text-lg text-muted leading-relaxed">
              Find the perfect tool for your workflow. Organized by category for quick discovery.
            </p>
          </div>
        </div>

        {/* ── Grid & Sidebar ── */}
        <div className="flex justify-center w-full mt-10">
          <ResponsiveAd type="horizontal" className="!my-0" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
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
            <ResponsiveAd type="sidebar" className="!my-0" />
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <ResponsiveAd type="native" className="!my-0" />
        </div>
      </div>
    </>
  )
}
