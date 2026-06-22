import { Link } from 'react-router-dom'
import { Twitter, Github, Linkedin, Mail, ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import { CATEGORIES, TOOLS } from '../../data/tools'
import React, { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const toolLinks = CATEGORIES.slice(0, 5).map(c => ({ label: c.name, to: `/category/${c.id}` }))
  
  const topSearchLinks = TOOLS
    .filter(t => t.isPopular)
    .slice(0, 5)
    .map(t => ({ label: t.name, to: `/tool/${t.id}` }))

  const companyLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
    { label: 'Partners', to: '/partners' },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookie' },
    { label: 'GDPR Compliance', to: '/gdpr' },
    { label: 'Accessibility', to: '/accessibility' },
  ]

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#E5E7EB]" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* ── Top grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">

          {/* Brand & Newsletter column */}
          <div className="lg:col-span-2 pr-0 lg:pr-12 flex flex-col">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-tight">TV</span>
              </div>
              <span className="font-bold text-[16px] text-[#111827] tracking-tight">ToolVerse</span>
            </Link>

            <p className="text-[14px] text-[#6B7280] leading-relaxed mb-8 max-w-sm">
              The definitive collection of 200+ free online tools for developers, designers, and creators. Fast, secure, and entirely browser-based.
            </p>

            {/* Newsletter */}
            <div className="mb-8 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
              <h3 className="text-[13px] font-semibold text-[#111827] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6B7280]" />
                Stay Updated
              </h3>
              <p className="text-[13px] text-[#6B7280] mb-4">
                Get notified about new tools. No spam, ever.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  <span className="text-sm text-[#059669] font-medium">You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="flex-1 px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111827] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1F2937] transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <div className="flex gap-3 mt-auto">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] hover:shadow-sm transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools Categories */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] tracking-wider uppercase mb-5">Categories</h3>
            <ul className="space-y-3">
              {toolLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/tools" className="text-[14px] text-[#111827] font-semibold hover:underline inline-flex items-center gap-1">
                  View all tools <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Searches */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] tracking-wider uppercase mb-5">Top Searches</h3>
            <ul className="space-y-3">
              {topSearchLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] tracking-wider uppercase mb-5">Company</h3>
            <ul className="space-y-3 mb-8">
              {companyLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-[13px] font-semibold text-[#111827] tracking-wider uppercase mb-5">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#9CA3AF]">
            © {new Date().getFullYear()} ToolVerse, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF] font-medium">
              <Shield className="w-4 h-4" /> 100% Private
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF] font-medium hidden sm:flex">
              <Lock className="w-4 h-4" /> Local Processing
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
