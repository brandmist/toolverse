import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Category, TOOLS } from '../../data/tools'
import { Icon } from './icon'

interface CategoryCardProps {
  category: Category
  index?: number
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  const toolCount = TOOLS.filter(t => t.categoryId === category.id).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        to={`/category/${category.id}`}
        className="group flex flex-col h-full bg-white border border-border rounded-2xl p-6 hover:border-border-hover hover:shadow-[0_4px_12px_rgb(0,0,0,0.08)] transition-all duration-200"
      >
        {/* Icon */}
        <div className="w-11 h-11 bg-surface border border-border rounded-xl flex items-center justify-center text-secondary mb-5 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
          <Icon name={category.icon} className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-primary mb-2 group-hover:text-black transition-colors">
            {category.name}
          </h3>
          <p className="text-[13px] text-muted leading-relaxed line-clamp-3 mb-4">
            {category.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
          <span className="text-[13px] font-semibold text-muted">
            {toolCount} tools
          </span>
          <span className="flex items-center gap-1 text-[13px] font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
            Browse <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
