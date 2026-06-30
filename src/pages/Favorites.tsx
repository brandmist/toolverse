import { useStore } from '../store/useStore'
import { TOOLS } from '../data/tools'
import { ToolCard } from '../components/ui/ToolCard'
import { HeartCrack } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { AdBanner } from '../components/ui/AdBanner'
import { NativeAd } from '../components/ui/NativeAd'

export function Favorites() {
  const { favorites } = useStore()
  const favoriteTools = TOOLS.filter(tool => favorites.includes(tool.id))
  
  // Get some recommended tools if favorites is empty
  const recommendedTools = TOOLS.filter(t => t.isPopular).slice(0, 4)

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen relative z-10 bg-surface">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-sans text-4xl md:text-5xl font-extrabold mb-4 text-text-primary tracking-tight">Your Favorites</h1>
        <p className="text-xl text-text-muted leading-relaxed">
          Tools you've saved for quick access. Stored securely on your device.
        </p>
      </div>

      <div className="flex justify-center w-full mb-8">
        <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
        <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
        <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteTools.map((tool, index) => (
            <div key={tool.id} className="h-48">
              <ToolCard tool={tool} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="py-24 w-full flex flex-col items-center justify-center text-center bg-card border border-border rounded-2xl shadow-sm mb-12">
            <div className="w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <HeartCrack className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-text-primary">No favorites yet</h2>
            <p className="text-text-muted mb-8 max-w-sm text-lg">
              You haven't added any tools to your favorites. Click the heart icon on any tool to save it here.
            </p>
            <Link to="/tools">
              <Button size="lg" className="bg-button-primary hover:opacity-90 text-button-primary-text font-semibold rounded-full px-8 py-6">Browse Directory</Button>
            </Link>
          </div>
          
          <div className="w-full text-left">
             <h3 className="text-2xl font-bold text-text-primary mb-6">Recommended for you</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {recommendedTools.map((tool, index) => (
                 <div key={tool.id} className="h-48">
                   <ToolCard tool={tool} index={index} />
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <NativeAd />
      </div>
    </div>
  )
}
