import React, { useState, useEffect } from 'react'
import { Layers, Copy, Check, Plus, Trash2, RotateCcw, Shuffle } from 'lucide-react';

export function CssShadowGenerator() {
  const [shadows, setShadows] = useState([
    { hOffset: 0, vOffset: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false },
    { hOffset: 0, vOffset: 4, blur: 6, spread: -2, color: '#000000', opacity: 5, inset: false }
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeShadow = shadows[activeIdx];

  const updateShadow = (field: string, val: any) => {
    const newShadows = [...shadows];
    newShadows[activeIdx] = { ...newShadows[activeIdx], [field]: val };
    setShadows(newShadows);
  };

  const addShadow = () => {
    if (shadows.length >= 6) return;
    setShadows([...shadows, { hOffset: 0, vOffset: 0, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false }]);
    setActiveIdx(shadows.length);
  };

  const removeShadow = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (shadows.length <= 1) return;
    const newShadows = shadows.filter((_, i) => i !== idx);
    setShadows(newShadows);
    if (activeIdx >= newShadows.length) setActiveIdx(newShadows.length - 1);
  };

  const hexToRgba = (hex: string, opacity: number) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const generateBoxShadow = () => {
    return shadows.map(s => 
      `${s.inset ? 'inset ' : ''}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
    ).join(',\n  ');
  };

  const css = `box-shadow:\n  ${generateBoxShadow()};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Controls */}
      <div className="flex-[1.2] flex flex-col gap-6 bg-white border border-border rounded-2xl p-6 shadow-sm max-h-[800px] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary mb-2">Shadow Layers</h3>
        
        {/* Layer list */}
        <div className="flex flex-col gap-2">
          {shadows.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${activeIdx === idx ? 'bg-surface border-[#111827] shadow-sm' : 'bg-white border-border hover:border-border-hover'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md shadow-sm border border-border" style={{ background: hexToRgba(s.color, s.opacity) }}></div>
                <span className="text-sm font-medium text-secondary">Layer {idx + 1}</span>
                {s.inset && <span className="text-[10px] bg-[#E5E7EB] text-muted px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">Inset</span>}
              </div>
              <button onClick={(e) => removeShadow(e, idx)} disabled={shadows.length <= 1} className={`p-1.5 rounded-md ${shadows.length <= 1 ? 'text-[#D1D5DB]' : 'text-danger hover:bg-[#FEE2E2]'}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {shadows.length < 6 && (
            <button onClick={addShadow} className="flex items-center justify-center gap-3 w-full p-3 mt-1 border border-dashed border-border-hover rounded-xl text-sm font-medium text-muted hover:bg-surface hover:text-primary transition-colors">
              <Plus className="w-4 h-4" /> Add Layer
            </button>
          )}
        </div>

        <div className="h-px bg-[#E5E7EB] my-2"></div>

        {/* Active Layer Controls */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-primary">Edit Layer {activeIdx + 1}</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={activeShadow.inset} onChange={e => updateShadow('inset', e.target.checked)} className="rounded text-primary focus:ring-primary" />
              <span className="text-[13px] font-medium text-secondary">Inset</span>
            </label>
          </div>

          {[
            { label: 'Horizontal Offset', key: 'hOffset', min: -100, max: 100 },
            { label: 'Vertical Offset', key: 'vOffset', min: -100, max: 100 },
            { label: 'Blur Radius', key: 'blur', min: 0, max: 100 },
            { label: 'Spread Radius', key: 'spread', min: -100, max: 100 },
            { label: 'Opacity (%)', key: 'opacity', min: 0, max: 100 }
          ].map(ctrl => (
            <div key={ctrl.key}>
              <div className="flex justify-between mb-1">
                <span className="text-[13px] font-semibold text-secondary">{ctrl.label}</span>
                <span className="text-[13px] font-medium text-muted">{(activeShadow as any)[ctrl.key]}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} value={(activeShadow as any)[ctrl.key]} onChange={e => updateShadow(ctrl.key, parseInt(e.target.value))} className="w-full accent-[#111827]" />
            </div>
          ))}

          <div>
            <span className="text-[13px] font-semibold text-secondary block mb-2">Color</span>
            <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border">
              <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border-hover shadow-sm">
                <input type="color" value={activeShadow.color} onChange={e => updateShadow('color', e.target.value)} className="absolute -top-3 -left-2 w-16 h-16 cursor-pointer" />
              </div>
              <input type="text" value={activeShadow.color} onChange={e => updateShadow('color', e.target.value)} className="w-full bg-white border border-border rounded-md px-3 py-1.5 text-primary text-sm uppercase focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

      </div>

      {/* Preview & Code */}
      <div className="flex-[1] flex flex-col gap-6">
        <div className="flex-1 bg-surface rounded-2xl border border-border min-h-[350px] flex items-center justify-center p-8 overflow-hidden relative radial-bg">
          {/* Subtle dotted background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          
          {/* Box Preview */}
          <div 
            className="w-48 h-48 bg-white rounded-2xl z-10 flex items-center justify-center border border-[#F3F4F6] transition-shadow duration-200"
            style={{ boxShadow: generateBoxShadow() }}
          >
            <span className="text-subtle font-medium text-sm">Preview</span>
          </div>
        </div>

        <div className="bg-primary rounded-xl p-4 shadow-sm relative group">
           <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">CSS Output</span>
           <code className="text-[#A7F3D0] font-mono text-[13px] whitespace-pre block pr-12">
             {css}
           </code>
           <button 
             onClick={copyToClipboard}
             className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
             title="Copy CSS"
           >
             {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

    </div>
  )
}

export function CssGlassmorphism() {
  const [blur, setBlur] = useState(12)
  const [transparency, setTransparency] = useState(25)
  const [tint, setTint] = useState('#ffffff')
  const [outline, setOutline] = useState(20)
  const [copied, setCopied] = useState(false)

  const hexToRgba = (hex: string, opacity: number) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 255;
    const g = parseInt(hex.substring(2, 4), 16) || 255;
    const b = parseInt(hex.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const bg = hexToRgba(tint, transparency);
  const border = hexToRgba('#ffffff', outline);

  const css = `background: ${bg};\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid ${border};\nborder-radius: 16px;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Controls */}
      <div className="flex-[1.2] flex flex-col gap-6 bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-2">Glass Settings</h3>
        
        <div className="space-y-5">
          {[
            { label: 'Blur Radius', val: blur, set: setBlur, min: 0, max: 50 },
            { label: 'Transparency (%)', val: transparency, set: setTransparency, min: 0, max: 100 },
            { label: 'Outline Opacity (%)', val: outline, set: setOutline, min: 0, max: 100 }
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[13px] font-semibold text-secondary">{ctrl.label}</span>
                <span className="text-[13px] font-medium text-muted">{ctrl.val}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val} onChange={e => ctrl.set(parseInt(e.target.value))} className="w-full accent-[#111827]" />
            </div>
          ))}

          <div>
            <span className="text-[13px] font-semibold text-secondary block mb-2">Tint Color</span>
            <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border">
              <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border-hover shadow-sm">
                <input type="color" value={tint} onChange={e => setTint(e.target.value)} className="absolute -top-3 -left-2 w-16 h-16 cursor-pointer" />
              </div>
              <input type="text" value={tint} onChange={e => setTint(e.target.value)} className="w-full bg-white border border-border rounded-md px-3 py-1.5 text-primary text-sm uppercase focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

      </div>

      {/* Preview */}
      <div className="flex-[1] flex flex-col gap-6">
        <div className="flex-1 rounded-2xl min-h-[350px] relative overflow-hidden bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#EF4444] p-8 flex flex-col items-center justify-center">
          {/* Animated background blobs */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-[#3B82F6] rounded-full mix-blend-multiply opacity-50 filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B] rounded-full mix-blend-multiply opacity-50 filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-48 h-48 bg-[#10B981] rounded-full mix-blend-multiply opacity-50 filter blur-3xl animate-blob animation-delay-4000"></div>

          {/* Glass Card */}
          <div 
            className="relative w-64 h-64 rounded-[16px] shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] z-10 flex flex-col p-6 border border-border transition-all duration-300"
            style={{ background: bg, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, borderColor: border }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center">
               <Layers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Glass Card</h3>
            <p className="text-sm text-white/90">Modern frosted glass effect generated entirely via CSS.</p>
          </div>
        </div>

        <div className="bg-primary rounded-xl p-4 shadow-sm relative group">
           <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">CSS Output</span>
           <code className="text-[#A7F3D0] font-mono text-[13px] whitespace-pre block pr-12">
             {css}
           </code>
           <button 
             onClick={copyToClipboard}
             className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
             title="Copy CSS"
           >
             {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

    </div>
  )
}

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
      <div className="flex-1 space-y-6 bg-white border border-border rounded-2xl p-6 shadow-sm">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Gradient Settings</h3>
          <button onClick={generateRandom} className="p-3 text-muted hover:text-primary hover:bg-surface-hover rounded-xl transition-colors" title="Randomize">
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-secondary block mb-2">Type</label>
          <div className="flex bg-surface-hover p-1 rounded-xl">
            <button onClick={() => setType('linear')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'linear' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-secondary'}`}>Linear</button>
            <button onClick={() => setType('radial')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'radial' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-secondary'}`}>Radial</button>
          </div>
        </div>

        {type === 'linear' ? (
          <div>
             <div className="flex justify-between mb-1">
               <span className="text-[13px] font-semibold text-secondary">Angle</span>
               <span className="text-[13px] font-medium text-muted">{angle}°</span>
             </div>
             <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-[#111827]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-secondary block mb-2">Shape</label>
              <select value={radialShape} onChange={e => setRadialShape(e.target.value as any)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-secondary block mb-2">Position</label>
              <select value={radialPos} onChange={e => setRadialPos(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
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
            <label className="text-[13px] font-semibold text-secondary">Color Stops</label>
            {colors.length < 5 && (
              <button onClick={addColor} className="text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Color
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border">
                <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border-hover shadow-sm">
                  <input type="color" value={color.c} onChange={e => updateColor(idx, 'c', e.target.value)} className="absolute -top-3 -left-2 w-16 h-16 cursor-pointer" />
                </div>
                <input type="text" value={color.c} onChange={e => updateColor(idx, 'c', e.target.value)} className="w-20 bg-white border border-border rounded-md px-2 py-1 text-primary text-xs uppercase focus:outline-none focus:border-primary" />
                <div className="flex-1 flex items-center gap-2">
                  <input type="range" min="0" max="100" value={color.pos} onChange={e => updateColor(idx, 'pos', parseInt(e.target.value))} className="w-full accent-[#111827]" />
                  <span className="text-xs font-medium text-muted w-8 text-right">{color.pos}%</span>
                </div>
                <button onClick={() => removeColor(idx)} disabled={colors.length <= 2} className={`p-1.5 rounded-md ${colors.length <= 2 ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-danger hover:bg-[#FEE2E2]'}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Preview */}
      <div className="flex-[1.2] flex flex-col gap-4">
        <div className="flex-1 rounded-2xl shadow-sm border border-border relative overflow-hidden min-h-[300px]" style={{ background: css.replace('background: ', '').replace(';', '') }}>
          {/* Preview canvas */}
        </div>
        
        <div className="bg-primary rounded-xl p-4 shadow-sm relative group">
           <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">CSS Output</span>
           <code className="text-[#A7F3D0] font-mono text-[13px] break-all block pr-12">
             {css}
           </code>
           <button 
             onClick={copyToClipboard}
             className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
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
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 space-y-4">
        {[
          { label: 'Size (px)', val: size, set: setSize, min: 20, max: 200 },
          { label: 'Border (px)', val: border, set: setBorder, min: 1, max: 20 },
          { label: 'Speed (s)', val: speed, set: setSpeed, min: 0.1, max: 5, step: 0.1 }
        ].map(ctrl => (
          <div key={ctrl.label}>
             <div className="flex justify-between mb-1">
               <span className="text-sm text-primary">{ctrl.label}</span>
               <span className="text-sm text-muted">{ctrl.val}</span>
             </div>
             <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step || 1} value={ctrl.val} onChange={e => ctrl.set(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
        <div>
          <label className="text-sm text-primary block mb-1">Loader Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 w-full bg-surface border border-border rounded-xl mb-4 flex items-center justify-center border border-border min-h-[200px]">
          <style>{css}</style>
          <div className="loader"></div>
        </div>
        <div className="w-full">
           <span className="text-xs text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <pre className="p-4 bg-surface border border-border border-border rounded-xl text-success font-mono text-xs break-all whitespace-pre-wrap cursor-pointer max-h-40 overflow-auto" onClick={() => navigator.clipboard.writeText(css)}>
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
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 space-y-6">
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-primary">Size</span>
             <span className="text-sm text-muted">{size}px</span>
           </div>
           <input type="range" min="10" max="250" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="text-sm text-primary block mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {['top', 'bottom', 'left', 'right'].map(dir => (
              <button 
                key={dir} 
                onClick={() => setDirection(dir as any)} 
                className={`w-full py-2 capitalize rounded-xl border transition-colors ${direction === dir ? 'bg-white border border-border border-border text-primary' : 'bg-white border border-border border-border text-muted hover:text-primary'}`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-primary block mb-1">Triangle Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-4 items-center justify-center">
         <div className="w-full flex-1 flex items-center justify-center bg-surface border border-border rounded-xl mb-4 p-8 border border-border overflow-hidden min-h-[250px]">
           <style>{css}</style>
           <div className="triangle"></div>
         </div>
         <div className="w-full">
           <span className="text-xs text-muted mb-2 block font-semibold uppercase">CSS Code</span>
           <pre className="p-4 bg-surface border border-border border-border rounded-xl text-success font-mono text-xs break-all whitespace-pre-wrap cursor-pointer" onClick={() => navigator.clipboard.writeText(css)}>
             {css}
           </pre>
        </div>
      </div>
    </div>
  )
}


// CSS Animation Generator
export function CssAnimationGenerator() {
  const [animationType, setAnimationType] = useState('bounce');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [iteration, setIteration] = useState('infinite');
  const [timing, setTiming] = useState('ease-in-out');
  const [copied, setCopied] = useState(false);

  const animations = {
    bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
}`,
    pulse: `@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.05); }
}`,
    spin: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    ping: `@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}`,
    shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`
  };

  const cssClass = `.animate-${animationType} {
  animation: ${animationType} ${duration}s ${timing} ${delay}s ${iteration};
}`;

  const fullCss = `${animations[animationType as keyof typeof animations]}\n\n${cssClass}`;

  // We inject the keyframes dynamically into the document head so the preview works
  useEffect(() => {
    const styleId = 'custom-animation-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = fullCss;
  }, [fullCss]);

  const copy = () => {
    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-2 block">Animation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(animations).map(type => (
                <button
                  key={type}
                  onClick={() => setAnimationType(type)}
                  className={`py-2 rounded-xl text-[13px] font-semibold capitalize transition-all ${animationType === type ? 'bg-primary text-white shadow-sm' : 'bg-surface-hover text-muted hover:text-primary'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-secondary mb-1 block">Duration ({duration}s)</label>
              <input type="range" min="0.1" max="5" step="0.1" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full accent-[#111827]" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-secondary mb-1 block">Delay ({delay}s)</label>
              <input type="range" min="0" max="5" step="0.1" value={delay} onChange={e => setDelay(parseFloat(e.target.value))} className="w-full accent-[#111827]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-secondary mb-1 block">Iterations</label>
              <select value={iteration} onChange={e => setIteration(e.target.value)} className="w-full p-3 bg-surface border border-border rounded-xl text-[13px] outline-none">
                <option value="infinite">Infinite</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-secondary mb-1 block">Timing</label>
              <select value={timing} onChange={e => setTiming(e.target.value)} className="w-full p-3 bg-surface border border-border rounded-xl text-[13px] outline-none">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-[#10B981] to-[#3B82F6] rounded-2xl flex items-center justify-center p-8 min-h-[250px] relative overflow-hidden">
             {/* Dotted pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
             
             <div className={`w-24 h-24 bg-white rounded-xl shadow-2xl animate-${animationType}`}></div>
          </div>
          
          <div className="bg-primary rounded-xl p-4 shadow-sm relative group min-h-[140px]">
             <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">CSS Code</span>
             <textarea readOnly value={fullCss} className="w-full h-[120px] bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0 pr-8" />
             <button onClick={copy} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm" title="Copy">
               {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
