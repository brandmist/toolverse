import { useState } from 'react'

export function HexRgba() {
  const [hex, setHex] = useState('#6366f1')
  const [opacity, setOpacity] = useState(100)

  // HEX to RGBA conversion
  const getRgba = () => {
    let raw = hex.replace('#', '')
    if (raw.length === 3) raw = raw.split('').map(c => c + c).join('')
    if (raw.length !== 6) return 'Invalid HEX'
    
    const r = parseInt(raw.substring(0, 2), 16)
    const g = parseInt(raw.substring(2, 4), 16)
    const b = parseInt(raw.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  const rgba = getRgba()

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-6">
        <div>
          <label className="text-sm text-text-primary block mb-1">HEX Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={hex.length === 7 ? hex : '#000000'} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0" />
            <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-grow bg-card border border-border border-white/10 rounded-lg px-4 py-3 text-text-primary text-lg font-mono uppercase" />
          </div>
        </div>
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Opacity</span>
             <span className="text-sm text-text-muted">{opacity}%</span>
           </div>
           <input type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="flex-1 right-panel flex items-center justify-center relative rounded-xl border border-white/5 min-h-[300px]" style={{
          backgroundImage: 'conic-gradient(#334155 90deg, #1e293b 90deg 180deg, #334155 180deg 270deg, #1e293b 270deg)',
          backgroundSize: '20px 20px'
      }}>
         <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: rgba !== 'Invalid HEX' ? rgba : 'transparent' }}></div>
         <div className="z-10 p-4 bg-surface border border-border backdrop-blur-sm border border-white/10 rounded-xl text-center shadow-xl">
            <span className="text-xs text-text-muted block mb-1 font-semibold uppercase">RGBA Output</span>
            <span className={`font-mono text-xl ${rgba === 'Invalid HEX' ? 'text-danger' : 'text-success'}`}>{rgba}</span>
         </div>
      </div>
    </div>
  )
}

export function ColorShades() {
  const [base, setBase] = useState('#6366f1')

  const generateShades = () => {
    let raw = base.replace('#', '')
    if (raw.length === 3) raw = raw.split('').map(c => c + c).join('')
    if (raw.length !== 6) return []
    
    let r = parseInt(raw.substring(0, 2), 16)
    let g = parseInt(raw.substring(2, 4), 16)
    let b = parseInt(raw.substring(4, 6), 16)

    const shades = []
    
    // Tints (lighter)
    for (let i = 5; i > 0; i--) {
      const tr = Math.round(r + (255 - r) * (i * 0.15))
      const tg = Math.round(g + (255 - g) * (i * 0.15))
      const tb = Math.round(b + (255 - b) * (i * 0.15))
      shades.push(`#${(tr).toString(16).padStart(2, '0')}${(tg).toString(16).padStart(2, '0')}${(tb).toString(16).padStart(2, '0')}`)
    }
    
    shades.push(base.toLowerCase())
    
    // Shades (darker)
    for (let i = 1; i <= 5; i++) {
      const sr = Math.round(r * (1 - i * 0.15))
      const sg = Math.round(g * (1 - i * 0.15))
      const sb = Math.round(b * (1 - i * 0.15))
      shades.push(`#${(sr).toString(16).padStart(2, '0')}${(sg).toString(16).padStart(2, '0')}${(sb).toString(16).padStart(2, '0')}`)
    }

    return shades
  }

  const shades = generateShades()

  return (
    <div className="flex flex-col h-full gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div>
        <label className="text-sm text-text-primary block mb-1">Base Color</label>
        <div className="flex items-center gap-2 max-w-sm">
          <input type="color" value={base.length === 7 ? base : '#000000'} onChange={e => setBase(e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0" />
          <input type="text" value={base} onChange={e => setBase(e.target.value)} className="flex-grow bg-card border border-border border-white/10 rounded-lg px-4 py-3 text-text-primary text-lg font-mono uppercase" />
        </div>
      </div>
      
      <div className="flex-grow min-h-[200px] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-inner border border-white/5">
        {shades.length > 0 ? shades.map((hex, i) => (
          <div 
            key={i} 
            className="flex-1 min-h-[50px] group flex flex-col md:justify-end p-2 md:p-4 transition-all hover:flex-[1.5] cursor-pointer"
            style={{ backgroundColor: hex }}
            onClick={() => { navigator.clipboard.writeText(hex); }}
          >
             <span className="text-xs font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-text-primary p-1 rounded inline-block text-center mt-auto md:w-full select-all">
               {hex}
             </span>
          </div>
        )) : (
          <div className="w-full flex items-center justify-center text-danger">Invalid HEX Color</div>
        )}
      </div>
    </div>
  )
}
