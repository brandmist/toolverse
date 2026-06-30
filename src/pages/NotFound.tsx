import { Link } from 'react-router-dom'
import { Search, ArrowLeft, ArrowRight } from 'lucide-react'
import { SEO } from '../components/ui/SEO'
import { TOOLS } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'

export function NotFound() {
  const popularTools = TOOLS.filter(t => t.isPopular).slice(0, 4)

  return (
    <>
      <SEO 
        title="Page Not Found — SmarTools"
        description="The page you're looking for doesn't exist. Browse 200+ free tools on SmarTools."
      />

      <div className="min-h-screen bg-white">
        {/* ── 404 Hero ── */}
        <div className="bg-white border-b border-border pt-24 pb-20">
          <div className="max-w-[640px] mx-auto px-6 text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-danger text-[12px] font-semibold rounded-full mb-8">
              404 Error
            </div>

            <h1 className="text-primary mb-4">Page not found</h1>
            <p className="text-[16px] text-muted leading-relaxed mb-10">
              We couldn't find the page you were looking for. It may have been moved, renamed, or no longer exists.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-secondary border border-border text-[14px] font-semibold rounded-xl hover:border-border-hover hover:bg-surface transition-all"
              >
                <Search className="w-4 h-4" />
                Search Tools
              </Link>
            </div>
          </div>
        </div>

        {/* ── Popular tools fallback ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[20px] font-bold text-primary mb-1">Try our popular tools</h2>
              <p className="text-[14px] text-muted">Don't leave empty-handed — these are our most-used utilities.</p>
            </div>
            <Link
              to="/tools"
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-secondary transition-colors shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool, i) => (
              <div key={tool.id} className="min-h-[160px]">
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
