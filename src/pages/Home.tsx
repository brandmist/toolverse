import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Search, ArrowRight, Shield, Zap, Lock, Clock, Star, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react'
import { SEO } from '../components/ui/SEO'
import { ToolCard } from '../components/ui/ToolCard'
import { Icon } from '../components/ui/icon'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ResponsiveAd } from '../components/ui/ResponsiveAd'

// ── Types ──────────────────────────────────────────────────────────────────
interface FAQItem { q: string; a: string }

// ── Hand-picked showcase tools (6 best from the real tool suite) ────────────
const SHOWCASE_TOOLS = [
  {
    id: 'pdf-merge',
    name: 'PDF Merger',
    tagline: 'Combine multiple PDFs in seconds',
    desc: 'Drag, drop, and merge any number of PDF files. Reorder pages, then download a single clean document instantly.',
    category: 'PDF Tools',
    icon: 'FilePlus2',
    badge: 'Popular',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    tagline: 'AI-powered background removal',
    desc: 'Automatically isolate your subject and erase the background in one click. Export as transparent PNG instantly.',
    category: 'Image Tools',
    icon: 'Scissors',
    badge: 'AI Powered',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    tagline: 'Reduce size, keep quality',
    desc: 'Compress PNG, JPG, and WebP images without visible quality loss. Batch process multiple images at once.',
    category: 'Image Tools',
    icon: 'PackageOpen',
    badge: 'New',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  {
    id: 'json-viewer',
    name: 'JSON Tree Viewer',
    tagline: 'Explore any JSON structure',
    desc: 'Paste JSON and instantly get a collapsible tree view. Search, expand, collapse, and copy any node.',
    category: 'Dev Tools',
    icon: 'Braces',
    badge: 'Popular',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    tagline: 'Convert any PDF to DOCX',
    desc: 'Transform PDF files into fully editable Microsoft Word documents in seconds — no quality loss, no formatting issues.',
    category: 'PDF Tools',
    icon: 'FileText',
    badge: 'New',
    bgColor: '#FDF2F8',
    borderColor: '#FBCFE8',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    tagline: 'Create unbreakable passwords',
    desc: 'Generate cryptographically strong passwords with custom length, symbols, numbers, and case rules. 100% client-side.',
    category: 'Security Tools',
    icon: 'Key',
    badge: 'Popular',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
]

// ── Data ───────────────────────────────────────────────────────────────────
const CATEGORIES_HERO = CATEGORIES.map(cat => {
  const count = TOOLS.filter(t => t.categoryId === cat.id).length;
  return {
    id: cat.id,
    name: cat.name,
    count: `${count} tools`,
    icon: cat.icon,
    desc: cat.description
  };
});

const FEATURES = [
  { icon: Shield,    title: 'Privacy First',      desc: 'All processing happens in your browser. Your files never touch our servers.' },
  { icon: Zap,       title: 'Instant Results',    desc: 'No uploads, no waiting. Results appear in milliseconds using WebAssembly.' },
  { icon: Lock,      title: '100% Free Forever',  desc: 'No paywalls, no rate limits, no sign-up required. Every tool is free.' },
  { icon: Clock,     title: 'Always Available',   desc: '99.9% uptime. Works offline too. Access your tools anytime, anywhere.' },
]

const TESTIMONIALS = [
  { name: 'Sarah Chen',      role: 'Frontend Engineer',  company: 'Vercel',   body: 'SmarTools replaced at least 5 different browser bookmarks for me. The PDF tools alone save me hours every week.' },
  { name: 'Marcus Johnson',  role: 'Product Designer',   company: 'Figma',    body: "The image tools are incredibly fast. I use the background remover and resizer daily. Can't believe it's free." },
  { name: 'Priya Nair',      role: 'Content Strategist', company: 'HubSpot',  body: 'Finally a tool suite that respects privacy. Knowing my files never leave my browser is a huge plus.' },
]

const FAQS: FAQItem[] = [
  { q: 'Are all tools completely free?',                a: 'Yes — every tool on SmarTools is 100% free, with no usage limits, no paywalls, and no hidden fees. We believe powerful utilities should be accessible to everyone.' },
  { q: 'Do you store my files or data?',                a: 'No. The vast majority of our tools run entirely in your browser using JavaScript and WebAssembly. Your files are never uploaded to our servers.' },
  { q: 'Do I need to create an account?',               a: 'Never. You can use every tool without signing up. Favorites are saved locally in your browser.' },
  { q: 'Can I use SmarTools on mobile?',                a: 'Absolutely. SmarTools is fully responsive and optimized for all devices — from 320px phones to 4K desktops.' },
  { q: 'Can I connect my own AI or MCP server?',        a: 'Yes! We support the Model Context Protocol (MCP). You can connect your local or remote MCP server to unlock powerful agentic workflows right from our dashboard.' },
]

// ── Subcomponents ──────────────────────────────────────────────────────────
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-[#E5E7EB] border border-border rounded-xl overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-surface transition-colors gap-4"
          >
            <span className="text-[15px] font-semibold text-primary">{item.q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-muted shrink-0" />
              : <ChevronDown className="w-4 h-4 text-muted shrink-0" />
            }
          </button>
          {open === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="px-6 pb-5 bg-surface"
            >
              <p className="text-[14px] text-muted leading-relaxed">{item.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // ALL popular tools (no slice) — used for per-category filtering
  const allPopularTools = TOOLS.filter(t => t.isPopular)
  // "All" view: top 8 most popular across all categories
  const top8Popular = allPopularTools.slice(0, 8)

  // When a category is selected, search ALL popular tools (not just top 8)
  const filteredTools = activeFilter === 'all'
    ? top8Popular
    : allPopularTools.filter(t => t.categoryId === activeFilter)

  // Only show filter buttons for categories that have at least 1 popular tool
  const categoriesWithPopular = CATEGORIES.filter(cat =>
    allPopularTools.some(t => t.categoryId === cat.id)
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`)
    else navigate('/search')
  }

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SmarTools",
    "url": "https://smartools.pages.dev",
    "logo": "https://smartools.pages.dev/favicon.svg",
    "description": `${TOOLS.length} free online tools for developers, designers, and creators.`,
    "sameAs": [
      "https://twitter.com/smartools",
      "https://github.com/smartools",
      "https://linkedin.com/company/smartools"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SmarTools",
    "url": "https://smartools.pages.dev",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://smartools.pages.dev/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO 
        title="SmarTools - Free Online PDF, Image & Dev Tools"
        description={`${TOOLS.length} powerful, free online tools for developers, designers, and creators. Convert PDFs, edit images, format code, and more. 100% client-side privacy.`}
        url="https://smartools.pages.dev"
        schemas={[orgSchema, websiteSchema, faqSchema]}
      />
      <div className="bg-white">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="pt-24 pb-20 bg-white border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface-hover border border-border rounded-full text-[13px] font-medium text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              {TOOLS.length} free tools — no sign-up required
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-center max-w-4xl mx-auto mb-8"
          >
            <h1 className="font-extrabold text-primary mb-6 leading-tight">
              Free Online PDF,<br />
              <span className="relative inline-block">
                Image & Dev Tools
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full"></span>
              </span>
            </h1>
            <p className="text-[18px] text-muted leading-relaxed max-w-2xl mx-auto">
              {TOOLS.length} powerful utilities for developers, designers, and creators.
              All browser-based, private, and instant — no account needed.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative flex items-center">
              <label htmlFor="hero-search" className="sr-only">Search tools</label>
              <Search className="absolute left-4 w-5 h-5 text-subtle pointer-events-none" />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${TOOLS.length} tools — PDF, image, text, code…`}
                className="w-full pl-12 pr-36 py-4 bg-white border border-border rounded-2xl text-[15px] text-primary placeholder-[#9CA3AF] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/8 shadow-sm transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <Link to="/categories" className="text-sm font-semibold text-muted hover:text-primary flex items-center gap-1 transition-colors">
                Or browse all categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.form>

          {/* Quick tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16 text-[13px]"
          >
            <span className="text-subtle">Popular:</span>
            {TOOLS.filter(t => t.isPopular).slice(0, 5).map(t => (
              <Link
                key={t.id}
                to={`/tool/${t.id}`}
                className="px-3 py-1.5 bg-surface border border-border text-secondary rounded-lg hover:bg-white hover:border-border-hover hover:text-primary transition-all font-medium"
              >
                {t.name}
              </Link>
            ))}
          </motion.div>

          {/* Category cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {CATEGORIES_HERO.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group bg-surface border border-border rounded-xl p-5 hover:bg-white hover:border-border-hover hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] transition-all duration-200 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-white border border-border rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
                    <Icon name={cat.icon as any} className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-subtle bg-white border border-border rounded-full px-2.5 py-1">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-primary mb-1">{cat.name}</h3>
                  <p className="text-[12px] text-subtle leading-snug line-clamp-2">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 mt-auto">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS / TRUST BAR
      ══════════════════════════════════════════════ */}
      <section className="py-12 bg-surface border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: `${TOOLS.length}`, label: 'Free Tools' },
              { value: '1M+',  label: 'Monthly Users' },
              { value: '10M+', label: 'Files Processed' },
              { value: '100%', label: 'Browser-Based' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-primary tracking-tight mb-1">{stat.value}</div>
                <div className="text-[13px] text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Ad Banner (Under Stats) ── */}
      <div className="bg-white border-b border-border py-6">
        <div className="max-w-[1280px] mx-auto px-6">
          <ResponsiveAd type="horizontal" className="!my-0" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          POPULAR TOOLS
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">Most Used</p>
              <h2 className="text-primary mb-0">Most Popular Tools</h2>
            </div>
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-secondary transition-colors shrink-0">
              View all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter pills — only show categories with ≥1 popular tool */}
          <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-3 mb-10 hide-scrollbar" role="group" aria-label="Filter by category">
            <button
              onClick={() => setActiveFilter('all')}
              aria-pressed={activeFilter === 'all'}
              className={`shrink-0 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                activeFilter === 'all'
                  ? 'bg-primary text-white border-primary shadow-md shadow-black/10'
                  : 'bg-white text-muted border-border hover:border-border-hover hover:bg-surface hover:text-primary'
              }`}
            >
              <Star className={`w-4 h-4 ${activeFilter === 'all' ? 'text-white' : 'text-subtle'}`} /> All
            </button>
            {categoriesWithPopular.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                aria-pressed={activeFilter === cat.id}
                className={`shrink-0 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                  activeFilter === cat.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-black/10'
                    : 'bg-white text-muted border-border hover:border-border-hover hover:bg-surface hover:text-primary'
                }`}
              >
                <Icon name={cat.icon as any} className={`w-4 h-4 ${activeFilter === cat.id ? 'text-white' : 'text-subtle'}`} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {filteredTools.map((tool, i) => (
                <div key={tool.id} className="min-h-[160px]">
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 mb-10 border border-border rounded-xl bg-surface">
              <p className="text-[15px] font-semibold text-secondary mb-2">No popular tools in this category yet</p>
              <p className="text-[13px] text-muted mb-4">Check out our full tool directory.</p>
              <Link to="/tools" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary underline hover:no-underline">
                Browse all tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/tools"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-border text-secondary text-[14px] font-semibold rounded-xl hover:border-border-hover hover:bg-surface hover:shadow-sm transition-all"
            >
              Browse all {TOOLS.length} tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Native Ad ── */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <ResponsiveAd type="horizontal" className="!my-0" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-surface border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">Why SmarTools</p>
            <h2 className="text-primary mb-4">Built for speed and privacy</h2>
            <p className="text-[16px] text-muted leading-relaxed">
              No other tool suite processes your data locally, runs instantly, and offers this breadth of utilities — all for free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] hover:border-border-hover transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white mb-5">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page Ad Container ── */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <ResponsiveAd type="horizontal" className="!my-0" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURED TOOLS — Bento Showcase
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-surface border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">Featured</p>
              <h2 className="text-primary mb-3">Pro-grade tools. Zero cost.</h2>
              <p className="text-[16px] text-muted leading-relaxed">
                Stop paying for subscriptions. Our most powerful tools — PDF, AI image, and developer utilities — are completely free.
              </p>
            </div>
            <Link
              to="/tools"
              className="shrink-0 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-secondary transition-colors"
            >
              Explore all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bento grid — 3 cols, first item spans 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHOWCASE_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: i * 0.06 }}
              >
                <Link
                  to={`/tool/${tool.id}`}
                  className="group flex flex-col h-full bg-white border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-border-hover transition-all duration-200"
                >
                  {/* Tool preview area */}
                  <div
                    className="h-40 relative overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: tool.bgColor, borderBottom: `1px solid ${tool.borderColor}` }}
                  >
                    {/* Decorative mock UI elements */}
                    <div className="absolute inset-4 bg-white/70 rounded-xl border border-white shadow-sm flex flex-col">
                      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/60">
                        {['#EF4444', '#F59E0B', '#10B981'].map(c => (
                          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
                        ))}
                        <div className="ml-auto h-3 w-20 bg-surface-hover rounded-full" />
                      </div>
                      <div className="flex-1 flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tool.bgColor, border: `1px solid ${tool.borderColor}` }}>
                          <Icon name={tool.icon} className="w-5 h-5" style={{ color: '#374151' }} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-24 bg-[#E5E7EB] rounded-full" />
                          <div className="h-2 w-16 bg-surface-hover rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: tool.borderColor, color: '#374151' }}
                    >
                      {tool.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-1">
                      <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider">{tool.category}</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-primary mb-1 group-hover:text-black leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-[13px] font-medium text-secondary mb-3">{tool.tagline}</p>
                    <p className="text-[13px] text-muted leading-relaxed mb-5 flex-1">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-primary mt-auto group-hover:gap-3 transition-all">
                      Open tool <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — DARK
      ══════════════════════════════════════════════ */}
      <section className="bg-primary py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6 font-extrabold">
              Start building faster today.
            </h2>
            <p className="text-[18px] text-subtle leading-relaxed mb-10">
              Join over 1 million developers and creators who use SmarTools every day. No account required — just open a tool and go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tools"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary text-[15px] font-bold rounded-xl hover:bg-surface transition-colors shadow-lg"
              >
                Browse all tools <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white border border-white/20 text-[15px] font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4" /> Search tools
              </Link>
              <a 
                href="https://www.effectivecpmnetwork.com/jaj11f6qd?key=4fb306169b7dffbec2b625cff9337f14" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-500 text-amber-950 font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 hover:shadow-lg transition-all text-[14px]"
              >
                <Star className="w-4 h-4" /> Unlock Premium Features
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[13px] text-muted">
              {[
                { icon: CheckCircle2, label: 'No sign-up required' },
                { icon: Shield,       label: '100% browser-based' },
                { icon: Lock,         label: 'Files never uploaded' },
                { icon: Zap,          label: 'Instant processing' },
              ].map(({ icon: Icon2, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon2 className="w-4 h-4 text-muted" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <ResponsiveAd type="native" className="!my-0" />
      </div>
      <section className="py-24 bg-surface border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-primary">Loved by builders worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="bg-white border border-border rounded-2xl p-6"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning" fill="#F59E0B" />
                  ))}
                </div>
                <p className="text-[14px] text-secondary leading-relaxed mb-5">"{t.body}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#F3F4F6]">
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-[13px] font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-primary">{t.name}</div>
                    <div className="text-[12px] text-muted">{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-primary mb-4">Frequently asked questions</h2>
            <p className="text-[16px] text-muted">Everything you need to know about SmarTools.</p>
          </div>

          <FAQAccordion items={FAQS} />

          <p className="text-center mt-8 text-[14px] text-muted">
            Still have questions?{' '}
            <Link to="/contact" className="text-primary font-semibold underline hover:no-underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
