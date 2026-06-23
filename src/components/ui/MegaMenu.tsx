import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { Icon } from './icon';

export function CategoryMegaMenu({ title, categoryId }: { title: string, categoryId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 150);
  };

  const categoryTools = TOOLS
    .filter(t => t.categoryId === categoryId)
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    .slice(0, 8);
  const category = CATEGORIES.find(c => c.id === categoryId);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link to={`/category/${categoryId}`} className="flex items-center gap-1 text-[#6B7280] hover:text-[#111827] transition-colors px-2 xl:px-3 py-2 rounded-md font-medium text-sm">
        {title} <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-[450px] pt-2 z-50"
          >
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
              <h3 className="text-[11px] font-bold text-[#6B7280] mb-4 uppercase tracking-wider flex items-center justify-between">
                <span>Top {title} Tools</span>
                <Link to={`/category/${categoryId}`} className="text-[#111827] hover:underline normal-case text-[12px] font-semibold">View all &rarr;</Link>
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {categoryTools.map(tool => (
                  <Link
                    key={tool.id}
                    to={`/tool/${tool.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAFAFA] transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shrink-0">
                      <Icon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[14px] font-medium text-[#111827] transition-colors truncate">{tool.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
