import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Heart, ArrowRight, Star } from 'lucide-react'
import { Tool, CATEGORIES } from '../../data/tools'
import { useStore } from '../../store/useStore'
import { Icon } from './icon'

interface ToolCardProps {
  tool: Tool
  index?: number
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index = 0 }) => {
  const { favorites, toggleFavorite } = useStore()
  const isFavorite = favorites.includes(tool.id)
  const category = CATEGORIES.find(c => c.id === tool.categoryId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      className="group relative h-full"
    >
      <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] transition-all duration-300">
        
        {/* Header: Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all duration-300">
            <Icon name={tool.icon} className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-0.5 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-[16px] font-bold text-[#111827] group-hover:text-black leading-tight line-clamp-3 pr-1">
                {tool.name}
              </h3>
              {/* Badges */}
              <div className="flex flex-wrap justify-end shrink-0 gap-1.5 mt-0.5">
                {tool.isPopular && <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md">Hot</span>}
                {tool.isNew && <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-md">New</span>}
              </div>
            </div>
            <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider truncate">{category?.name}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#4B5563] leading-relaxed line-clamp-3 mb-5 flex-1">
          {tool.description}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
               <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
               <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
               <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
               <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
               <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            </div>
            <span className="text-[13px] font-semibold text-[#6B7280] ml-1">{tool.rating || '4.9'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.preventDefault(); toggleFavorite(tool.id) }}
              className="p-3 rounded-xl text-[#D1D5DB] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors relative z-20"
              aria-label="Toggle Favorite"
            >
              <Heart className="w-4 h-4" fill={isFavorite ? '#EF4444' : 'none'} stroke={isFavorite ? '#EF4444' : 'currentColor'} />
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#374151] group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <Link to={`/tool/${tool.id}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={`Open ${tool.name}`} />
      </div>
    </motion.div>
  )
}
