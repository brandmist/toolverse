import { useState, useEffect } from 'react'
import { Button } from './button'
import { Copy, RefreshCw } from 'lucide-react'

export function ColorPaletteGenerator() {
  const [colors, setColors] = useState<string[]>([])

  const generateColors = () => {
    const newColors = Array.from({length: 5}, () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase())
    setColors(newColors)
  }

  useEffect(() => {
    generateColors()
  }, [])

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-grow flex flex-col sm:flex-row rounded-xl overflow-hidden mb-6 border border-[#E5E7EB] min-h-[250px]">
         {colors.map((color, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end p-4 transition-all duration-300 hover:flex-[1.5] cursor-pointer group" style={{backgroundColor: color}}>
               <button 
                 onClick={() => { navigator.clipboard.writeText(color); alert(`Copied ${color}`); }}
                 className="bg-black/40 backdrop-blur-sm text-[#111827] px-3 py-1.5 rounded-xl text-sm font-mono hover:bg-black/60 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0"
               >
                 {color} <Copy className="w-3 h-3" />
               </button>
            </div>
         ))}
      </div>
      <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0" size="lg" onClick={generateColors}>
        <RefreshCw className="w-4 h-4 mr-2" /> Generate New Palette
      </Button>
    </div>
  )
}
