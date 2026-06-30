import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { Icon } from './icon';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle modal via Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    const handleOpenModal = () => setIsOpen(true);
    
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenModal);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenModal);
    };
  }, []);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredTools = query
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (toolId: string) => {
    navigate(`/tool/${toolId}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0 && filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-border transform transition-all mx-4">
        
        {/* Input area */}
        <div className="flex items-center px-4 py-4 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-subtle shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 text-primary text-[16px] placeholder:text-subtle"
            placeholder="Search 160+ tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1 shrink-0 bg-white border border-border rounded-md px-2 py-1 shadow-sm">
            <span className="text-[11px] font-bold text-muted">ESC</span>
          </div>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Command className="w-10 h-10 text-[#D1D5DB] mb-4" />
              <p className="text-[15px] font-semibold text-secondary mb-1">What are you looking for?</p>
              <p className="text-[13px] text-muted">Search for "PDF to Word", "Image Compressor", etc.</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[15px] font-semibold text-secondary mb-1">No tools found</p>
              <p className="text-[13px] text-muted">Try searching for something else.</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredTools.map((tool, index) => (
                <div
                  key={tool.id}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(tool.id)}
                  className={`flex items-center gap-4 px-4 py-3 cursor-pointer mx-2 rounded-xl transition-colors ${
                    index === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${index === selectedIndex ? 'bg-white shadow-sm border border-border text-primary' : 'bg-surface text-muted'}`}>
                    <Icon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold truncate ${index === selectedIndex ? 'text-primary' : 'text-secondary'}`}>{tool.name}</p>
                    <p className="text-[12px] text-muted truncate">{tool.description}</p>
                  </div>
                  {index === selectedIndex && (
                    <CornerDownLeft className="w-4 h-4 text-subtle shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
