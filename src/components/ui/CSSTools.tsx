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

import { RotateCcw, Shuffle, Plus, Trash2, Copy, Check } from 'lucide-react';

export function CssGradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [colors, setColors] = useState<{c: string, pos: number}[]>([
    { c: '#6366f1', pos: 0 },
    { c: '#a855f7', pos: 100 }
  ])
  const [angle, setAngle] = useState(135)
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle')
  const [radialPos, setRadialPos] = useState('center')
  const [copied, setCopied] = useState(false)

  const addColor = () => {
    if (colors.length >= 5) return;
    const newColors = [...colors];
    // Insert new color in the middle
    newColors.splice(colors.length - 1, 0, { c: '#ec4899', pos: 50 });
    setColors(newColors);
  }

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  }

  const updateColor = (index: number, field: 'c' | 'pos', val: any) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: val };
    setColors(newColors);
  }

  const generateRandom = () => {
    const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColors([
      { c: randomHex(), pos: 0 },
      { c: randomHex(), pos: 100 }
    ]);
    setAngle(Math.floor(Math.random() * 360));
  }

  const sortedColors = [...colors].sort((a,b) => a.pos - b.pos);
  const colorString = sortedColors.map(c => `${c.c} ${c.pos}%`).join(', ');

  const css = type === 'linear'
    ? `background: linear-gradient(${angle}deg, ${colorString});`
    : `background: radial-gradient(${radialShape} at ${radialPos}, ${colorString});`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Controls */}
      <div className="flex-1 space-y-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#111827]">Gradient Settings</h3>
          <button onClick={generateRandom} className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors" title="Randomize">
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#374151] block mb-2">Type</label>
          <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
            <button onClick={() => setType('linear')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'linear' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}>Linear</button>
            <button onClick={() => setType('radial')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'radial' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}>Radial</button>
          </div>
        </div>

        {type === 'linear' ? (
          <div>
             <div className="flex justify-between mb-1">
               <span className="text-[13px] font-semibold text-[#374151]">Angle</span>
               <span className="text-[13px] font-medium text-[#6B7280]">{angle}°</span>
             </div>
             <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-[#111827]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151] block mb-2">Shape</label>
              <select value={radialShape} onChange={e => setRadialShape(e.target.value as any)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] text-sm focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]">
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151] block mb-2">Position</label>
              <select value={radialPos} onChange={e => setRadialPos(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] text-sm focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]">
                <option value="center">Center</option>
                <option value="top left">Top Left</option>
                <option value="top">Top</option>
                <option value="top right">Top Right</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom">Bottom</option>
                <option value="bottom right">Bottom Right</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[13px] font-semibold text-[#374151]">Color Stops</label>
            {colors.length < 5 && (
              <button onClick={addColor} className="text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Color
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
                <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-[#D1D5DB] shadow-sm">
                  <input type="color" value={color.c} onChange={e => updateColor(idx, 'c', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
                </div>
                <input type="text" value={color.c} onChange={e => updateColor(idx, 'c', e.target.value)} className="w-20 bg-white border border-[#E5E7EB] rounded-md px-2 py-1 text-[#111827] text-xs uppercase focus:outline-none focus:border-[#111827]" />
                <div className="flex-1 flex items-center gap-2">
                  <input type="range" min="0" max="100" value={color.pos} onChange={e => updateColor(idx, 'pos', parseInt(e.target.value))} className="w-full accent-[#111827]" />
                  <span className="text-xs font-medium text-[#6B7280] w-8 text-right">{color.pos}%</span>
                </div>
                <button onClick={() => removeColor(idx)} disabled={colors.length <= 2} className={`p-1.5 rounded-md ${colors.length <= 2 ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#EF4444] hover:bg-[#FEE2E2]'}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Preview */}
      <div className="flex-[1.2] flex flex-col gap-4">
        <div className="flex-1 rounded-2xl shadow-sm border border-[#E5E7EB] relative overflow-hidden min-h-[300px]" style={{ background: css.replace('background: ', '').replace(';', '') }}>
          {/* Preview canvas */}
        </div>
        
        <div className="bg-[#111827] rounded-xl p-4 shadow-sm relative group">
           <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">CSS Output</span>
           <code className="text-[#A7F3D0] font-mono text-[13px] break-all block pr-12">
             {css}
           </code>
           <button 
             onClick={copyToClipboard}
             className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
             title="Copy CSS"
           >
             {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
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
