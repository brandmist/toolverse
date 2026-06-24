import { useState, useMemo } from 'react'
import { Button } from './button'
import { Copy } from 'lucide-react'

// RGB to HEX converter
export function RgbHex() {
  const [r, setR] = useState(99)
  const [g, setG] = useState(102)
  const [b, setB] = useState(241)

  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0').toUpperCase()
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 space-y-6">
        {[{ label: 'R (Red)', val: r, set: setR }, { label: 'G (Green)', val: g, set: setG }, { label: 'B (Blue)', val: b, set: setB }].map(({ label, val, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#111827]">{label}</span>
              <span className="text-sm text-[#6B7280] font-mono">{val}</span>
            </div>
            <input type="range" min="0" max="255" value={val} onChange={e => set(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            <input type="number" min="0" max="255" value={val} onChange={e => set(parseInt(e.target.value) || 0)} className="mt-2 w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-2 text-[#111827] text-sm" />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-48 h-48 rounded-2xl shadow-2xl border border-[#E5E7EB] transition-all" style={{ backgroundColor: hex }} />
        <div className="text-center space-y-3 w-full max-w-xs">
          <div className="flex items-center gap-3 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-5 py-3 justify-between">
            <span className="font-mono text-2xl font-bold text-success tracking-wider">{hex}</span>
            <button onClick={() => navigator.clipboard.writeText(hex)} className="text-[#6B7280] hover:text-[#111827] transition-colors"><Copy className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-[#6B7280]">rgb({r}, {g}, {b})</p>
        </div>
      </div>
    </div>
  )
}

// Color Mixer
export function ColorMixer() {
  const [color1, setColor1] = useState('#6366f1')
  const [color2, setColor2] = useState('#06b6d4')
  const [ratio, setRatio] = useState(50)

  const hexToRgb = (hex: string) => {
    const raw = hex.replace('#', '')
    if (raw.length !== 6) return { r: 0, g: 0, b: 0 }
    return {
      r: parseInt(raw.substring(0, 2), 16),
      g: parseInt(raw.substring(2, 4), 16),
      b: parseInt(raw.substring(4, 6), 16),
    }
  }

  const mixed = useMemo(() => {
    const c1 = hexToRgb(color1)
    const c2 = hexToRgb(color2)
    const t = ratio / 100
    const r = Math.round(c1.r * (1 - t) + c2.r * t)
    const g = Math.round(c1.g * (1 - t) + c2.g * t)
    const b = Math.round(c1.b * (1 - t) + c2.b * t)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }, [color1, color2, ratio])

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full h-32 rounded-xl shadow-lg border border-[#E5E7EB]" style={{ backgroundColor: color1 }} />
          <div className="flex items-center gap-3 w-full">
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 flex-shrink-0" />
            <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="flex-grow bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-2 text-[#111827] text-sm uppercase font-mono" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-32 rounded-xl shadow-lg border border-[#E5E7EB] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: mixed }}>
            <div className="absolute inset-0 flex">
              <div className="flex-1" style={{ backgroundColor: color1, opacity: 1 - ratio / 100 }} />
              <div className="flex-1" style={{ backgroundColor: color2, opacity: ratio / 100 }} />
            </div>
            <span className="relative z-10 font-mono text-sm font-bold text-[#111827] drop-shadow-lg">{mixed.toUpperCase()}</span>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>Color 1</span>
              <span>{ratio}% / {100 - ratio}%</span>
              <span>Color 2</span>
            </div>
            <input type="range" min="0" max="100" value={ratio} onChange={e => setRatio(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <button onClick={() => navigator.clipboard.writeText(mixed)} className="flex items-center gap-3 text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
            <Copy className="w-4 h-4" /> Copy {mixed.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-full h-32 rounded-xl shadow-lg border border-[#E5E7EB]" style={{ backgroundColor: color2 }} />
          <div className="flex items-center gap-3 w-full">
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 flex-shrink-0" />
            <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="flex-grow bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-2 text-[#111827] text-sm uppercase font-mono" />
          </div>
        </div>
      </div>
    </div>
  )
}
