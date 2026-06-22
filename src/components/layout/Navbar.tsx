import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Search, Menu, X, Heart, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { CATEGORIES } from '../../data/tools'

import { CategoryMegaMenu } from '../ui/MegaMenu'

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { favorites } = useStore()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const navLinks = [
    { label: 'All Tools', to: '/tools' },
    { label: 'Categories', to: '/categories' },
    { label: 'Blog', to: '/blog' },
  ]

  const toolCategories = CATEGORIES.map(c => ({ id: c.id, name: c.name }))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ${
        scrolled
          ? 'bg-white border-b border-[#E5E7EB] shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]'
          : 'bg-white/95 border-b border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="ToolVerse Home">
            <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">TV</span>
            </div>
            <span className="font-bold text-[15px] text-[#111827] tracking-tight hidden sm:block">
              ToolVerse
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <CategoryMegaMenu title="Image" categoryId="image" />
            <CategoryMegaMenu title="PDF" categoryId="pdf" />
            <CategoryMegaMenu title="Text" categoryId="text" />
            <CategoryMegaMenu title="Utility" categoryId="utility" />
            
            <div className="w-px h-5 bg-[#E5E7EB] mx-2"></div>

            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#111827] bg-[#F3F4F6]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search button — desktop */}
            <Link
              to="/search"
              aria-label="Search tools"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:border-[#D1D5DB] hover:bg-white transition-all w-48"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1">Search tools…</span>
              <kbd className="text-[10px] font-mono bg-white border border-[#E5E7EB] rounded px-1.5 py-0.5 text-[#9CA3AF]">⌘K</kbd>
            </Link>

            {/* Search icon — mobile */}
            <Link
              to="/search"
              aria-label="Search"
              className="md:hidden p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              aria-label={`Favorites (${favorites.length})`}
              className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" fill={favorites.length > 0 ? '#EF4444' : 'none'} stroke={favorites.length > 0 ? '#EF4444' : 'currentColor'} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#111827] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-t border-[#E5E7EB] overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-4 space-y-1">
              <Link to="/tools" className="block px-3 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors">All Tools</Link>
              <Link to="/categories" className="block px-3 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors">Categories</Link>
              <Link to="/blog" className="block px-3 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors">Blog</Link>

              <div className="pt-3 pb-1 border-t border-[#F3F4F6] mt-3">
                <p className="px-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Browse by Category</p>
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="px-3 py-2 text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
