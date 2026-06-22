import { useState } from 'react'

export function CssShadowGenerator() {
  const [hOffset, setHOffset] = useState(10)
  const [vOffset, setVOffset] = useState(10)
  const [blur, setBlur] = useState(15)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState('#000000')
  const [opacity, setOpacity] = useState(50)

  const getRgba = () => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  const boxShadow = `${hOffset}px ${vOffset}px ${blur}px ${spread}px ${getRgba()}`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-4">
        {[
          { label: 'Horizontal Offset', val: hOffset, set: setHOffset, min: -100, max: 100 },
          { label: 'Vertical Offset', val: vOffset, set: setVOffset, min: -100, max: 100 },
          { label: 'Blur Radius', val: blur, set: setBlur, min: 0, max: 100 },
          { label: 'Spread Radius', val: spread, set: setSpread, min: -100, max: 100 },
          { label: 'Opacity', val: opacity, set: setOpacity, min: 0, max: 100 }
        ].map(ctrl => (
          <div key={ctrl.label}>
             <div className="flex justify-between mb-1">
               <span className="text-sm text-text-primary">{ctrl.label}</span>
               <span className="text-sm text-text-muted">{ctrl.val}</span>
             </div>
             <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val} onChange={e => ctrl.set(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Shadow Color</span>
             <span className="text-sm text-text-muted">{color}</span>
           </div>
           <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-4 items-center">
        <div className="w-48 h-48 bg-white rounded-xl mb-8 transition-shadow flex items-center justify-center font-bold text-text-primary" style={{ boxShadow }}>
          Preview Box
        </div>
        <div className="w-full">
           <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <div className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-sm break-all font-medium cursor-pointer hover:bg-card border border-border transition-colors" onClick={() => navigator.clipboard.writeText(`box-shadow: ${boxShadow};`)}>
             box-shadow: {boxShadow};
           </div>
        </div>
      </div>
    </div>
  )
}

export function CssGlassmorphism() {
  const [blur, setBlur] = useState(10)
  const [opacity, setOpacity] = useState(10)

  const bg = `rgba(255, 255, 255, ${opacity / 100})`
  const css = `background: ${bg};\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.18);`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-6">
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Blur Value</span>
             <span className="text-sm text-text-muted">{blur}px</span>
           </div>
           <input type="range" min="0" max="50" value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Transparency</span>
             <span className="text-sm text-text-muted">{opacity}%</span>
           </div>
           <input type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="w-full mt-8">
           <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <pre className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-sm break-all whitespace-pre-wrap cursor-pointer" onClick={() => navigator.clipboard.writeText(css)}>
             {css}
           </pre>
        </div>
      </div>
      <div className="flex-1 p-8 rounded-xl flex items-center justify-center relative overflow-hidden">
         <div className="absolute top-10 left-10 w-24 h-24 bg-card border border-border rounded-full mix-blend-multiply opacity-70 filter blur-xl animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-32 h-32 bg-card border border-border rounded-full mix-blend-multiply opacity-70 filter blur-xl animate-pulse delay-700"></div>
         
         <div className="w-64 h-64 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] z-10 flex flex-col p-6 text-text-primary border border-white/20" style={{ background: bg, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }}>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Glass Card</h3>
            <p className="text-sm text-text-primary">Beautiful modern glass effect generated entirely via CSS properties.</p>
         </div>
      </div>
    </div>
  )
}

export function CssGradientGenerator() {
  const [color1, setColor1] = useState('#6366f1')
  const [color2, setColor2] = useState('#a855f7')
  const [angle, setAngle] = useState(135)

  const css = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-primary block mb-1">Color 1</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
              <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="flex-grow bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm uppercase" />
            </div>
          </div>
          <div>
            <label className="text-sm text-text-primary block mb-1">Color 2</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
              <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="flex-grow bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm uppercase" />
            </div>
          </div>
        </div>
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Angle</span>
             <span className="text-sm text-text-muted">{angle}°</span>
           </div>
           <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="w-full mt-8">
           <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <div className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-sm break-all cursor-pointer hover:bg-card border border-border transition-colors" onClick={() => navigator.clipboard.writeText(css)}>
             {css}
           </div>
        </div>
      </div>
      <div className="flex-[1.5] rounded-xl shadow-inner border border-white/10" style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }}>
      </div>
    </div>
  )
}

export function CssLoaderGenerator() {
  const [size, setSize] = useState(48)
  const [border, setBorder] = useState(5)
  const [color, setColor] = useState('#6366f1')
  const [speed, setSpeed] = useState(1)

  const css = `.loader {
  width: ${size}px;
  height: ${size}px;
  border: ${border}px solid #ffffff33;
  border-bottom-color: ${color};
  border-radius: 50%;
  display: inline-block;
  animation: rotation ${speed}s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-4">
        {[
          { label: 'Size (px)', val: size, set: setSize, min: 20, max: 200 },
          { label: 'Border (px)', val: border, set: setBorder, min: 1, max: 20 },
          { label: 'Speed (s)', val: speed, set: setSpeed, min: 0.1, max: 5, step: 0.1 }
        ].map(ctrl => (
          <div key={ctrl.label}>
             <div className="flex justify-between mb-1">
               <span className="text-sm text-text-primary">{ctrl.label}</span>
               <span className="text-sm text-text-muted">{ctrl.val}</span>
             </div>
             <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step || 1} value={ctrl.val} onChange={e => ctrl.set(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
        <div>
          <label className="text-sm text-text-primary block mb-1">Loader Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 w-full bg-surface border border-border rounded-xl mb-4 flex items-center justify-center border border-white/5 min-h-[200px]">
          <style>{css}</style>
          <div className="loader"></div>
        </div>
        <div className="w-full">
           <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <pre className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-xs break-all whitespace-pre-wrap cursor-pointer max-h-40 overflow-auto" onClick={() => navigator.clipboard.writeText(css)}>
             {css}
           </pre>
        </div>
      </div>
    </div>
  )
}

export function CssTriangleGenerator() {
  const [size, setSize] = useState(50)
  const [color, setColor] = useState('#6366f1')
  const [direction, setDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('top')

  const getBorders = () => {
    switch(direction) {
      case 'top': return `border-left: ${size}px solid transparent;\nborder-right: ${size}px solid transparent;\nborder-bottom: ${size}px solid ${color};`
      case 'bottom': return `border-left: ${size}px solid transparent;\nborder-right: ${size}px solid transparent;\nborder-top: ${size}px solid ${color};`
      case 'left': return `border-top: ${size}px solid transparent;\nborder-bottom: ${size}px solid transparent;\nborder-right: ${size}px solid ${color};`
      case 'right': return `border-top: ${size}px solid transparent;\nborder-bottom: ${size}px solid transparent;\nborder-left: ${size}px solid ${color};`
    }
  }

  const css = `.triangle {
  width: 0;
  height: 0;
  ${getBorders()}
}`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-6">
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-text-primary">Size</span>
             <span className="text-sm text-text-muted">{size}px</span>
           </div>
           <input type="range" min="10" max="250" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="text-sm text-text-primary block mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {['top', 'bottom', 'left', 'right'].map(dir => (
              <button 
                key={dir} 
                onClick={() => setDirection(dir as any)} 
                className={`w-full py-2 capitalize rounded-lg border transition-colors ${direction === dir ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-text-primary block mb-1">Triangle Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-4 items-center justify-center">
         <div className="w-full flex-1 flex items-center justify-center bg-surface border border-border rounded-xl mb-4 p-8 border border-white/5 overflow-hidden min-h-[250px]">
           <style>{css}</style>
           <div className="triangle"></div>
         </div>
         <div className="w-full">
           <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <pre className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-xs break-all whitespace-pre-wrap cursor-pointer" onClick={() => navigator.clipboard.writeText(css)}>
             {css}
           </pre>
        </div>
      </div>
    </div>
  )
}
