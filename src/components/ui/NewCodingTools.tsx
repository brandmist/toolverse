import { useState, useMemo } from 'react'
import { Button } from './button'
import { Copy, Check, Shuffle } from 'lucide-react'

// JSON Minifier
export function JsonMinifier() {
  const [input, setInput] = useState('{\n  "name": "SmarTools",\n  "version": "1.0.0",\n  "description": "Browser-based tools collection"\n}')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'minify' | 'prettify'>('minify')

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try {
      setError('')
      const parsed = JSON.parse(input)
      if (mode === 'minify') return JSON.stringify(parsed)
      return JSON.stringify(parsed, null, 2)
    } catch (e: any) {
      setError(e.message)
      return ''
    }
  }, [input, mode])

  const savings = output && mode === 'minify' ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2">
          <button onClick={() => setMode('minify')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === 'minify' ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}>Minify</button>
          <button onClick={() => setMode('prettify')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === 'prettify' ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}>Prettify</button>
        </div>
        {savings > 0 && <span className="text-success text-sm font-medium ml-2">Saved {savings}% ({input.length - output.length} bytes)</span>}
        {error && <span className="text-danger text-sm">{error}</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-[350px]">
        <div className="flex flex-col">
          <label className="text-sm text-text-primary mb-2">Input JSON ({input.length} bytes)</label>
          <textarea
            className="flex-grow p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-text-primary">Output {output && `(${output.length} bytes)`}</label>
            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>}
          </div>
          <textarea
            readOnly
            className="flex-grow p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-success font-mono text-sm"
            value={output}
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  )
}

// Code Diff Checker
export function DiffChecker() {
  const [left, setLeft] = useState('function greet(name) {\n  console.log("Hello " + name);\n  return true;\n}')
  const [right, setRight] = useState('function greet(name, greeting = "Hello") {\n  console.log(greeting + " " + name + "!");\n  return name;\n}')

  const diff = useMemo(() => {
    const lLines = left.split('\n')
    const rLines = right.split('\n')
    const maxLen = Math.max(lLines.length, rLines.length)
    const result: { left: string | null; right: string | null; type: 'same' | 'changed' | 'added' | 'removed' }[] = []

    for (let i = 0; i < maxLen; i++) {
      const l = i < lLines.length ? lLines[i] : null
      const r = i < rLines.length ? rLines[i] : null
      if (l === r) result.push({ left: l, right: r, type: 'same' })
      else if (l === null) result.push({ left: null, right: r, type: 'added' })
      else if (r === null) result.push({ left: l, right: null, type: 'removed' })
      else result.push({ left: l, right: r, type: 'changed' })
    }
    return result
  }, [left, right])

  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    changed: diff.filter(d => d.type === 'changed').length,
  }

  return (
    <div className="flex flex-col gap-4 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex gap-4 text-sm flex-wrap">
        {stats.added > 0 && <span className="text-success font-medium">+{stats.added} added</span>}
        {stats.removed > 0 && <span className="text-danger font-medium">-{stats.removed} removed</span>}
        {stats.changed > 0 && <span className="text-warning font-medium">~{stats.changed} modified</span>}
        {stats.added === 0 && stats.removed === 0 && stats.changed === 0 && <span className="text-text-muted">No differences found</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-text-primary mb-2 block">Original Code</label>
          <textarea className="w-full h-52 p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={left} onChange={e => setLeft(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-text-primary mb-2 block">Modified Code</label>
          <textarea className="w-full h-52 p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={right} onChange={e => setRight(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border border-border border-white/10 rounded-xl overflow-auto max-h-80 flex-grow">
        <div className="grid grid-cols-[auto_1fr_auto_1fr] text-xs font-mono">
          <div className="bg-card border border-border px-2 py-1.5 text-text-muted border-b border-white/5 col-span-2 font-semibold">ORIGINAL</div>
          <div className="bg-card border border-border px-2 py-1.5 text-text-muted border-b border-white/5 col-span-2 font-semibold">MODIFIED</div>
          {diff.map((row, i) => {
            const bgMap = { same: '', changed: 'bg-surface border border-border', added: 'bg-surface border border-border', removed: 'bg-surface border border-border' }
            const textMap = { same: 'text-text-muted', changed: 'text-warning', added: 'text-text-primary', removed: 'text-danger' }
            const textMapR = { same: 'text-text-muted', changed: 'text-warning', added: 'text-success', removed: 'text-text-primary' }
            const prefix = { same: ' ', changed: '~', added: '+', removed: '-' }
            const prefixColor = { same: 'text-text-primary', changed: 'text-warning', added: 'text-success', removed: 'text-danger' }
            return (
              <>
                <div key={`lp-${i}`} className={`px-2 py-0.5 ${bgMap[row.type]} ${prefixColor[row.type]}`}>{prefix[row.type]}</div>
                <div key={`l-${i}`} className={`px-3 py-0.5 ${bgMap[row.type]} ${textMap[row.type]} whitespace-pre border-r border-white/5`}>{row.left ?? ''}</div>
                <div key={`rp-${i}`} className={`px-2 py-0.5 ${bgMap[row.type]} ${prefixColor[row.type]}`}>{prefix[row.type]}</div>
                <div key={`r-${i}`} className={`px-3 py-0.5 ${bgMap[row.type]} ${textMapR[row.type]} whitespace-pre`}>{row.right ?? ''}</div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// CSS Border Radius Generator
export function CssBorderRadius() {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'simple' | 'advanced'>('advanced');
  
  // 8 values for fancy border radius: tl, tr, br, bl / tl-y, tr-y, br-y, bl-y
  const [vals, setVals] = useState({
    tl: 30, tr: 70, br: 70, bl: 30,
    tlY: 30, trY: 30, brY: 70, blY: 70
  });

  const generateRandom = () => {
    const r = () => Math.floor(Math.random() * 60) + 20; // 20-80% for nice blobs
    setVals({
      tl: r(), tr: r(), br: r(), bl: r(),
      tlY: r(), trY: r(), brY: r(), blY: r()
    });
  };

  const updateVal = (k: keyof typeof vals, v: number) => {
    if (mode === 'simple') {
      // In simple mode, update both X and Y axis simultaneously
      setVals({ ...vals, [k]: v, [`${String(k)}Y`]: v });
    } else {
      setVals({ ...vals, [k]: v });
    }
  };

  const css = mode === 'advanced'
    ? `border-radius: ${vals.tl}% ${vals.tr}% ${vals.br}% ${vals.bl}% / ${vals.tlY}% ${vals.trY}% ${vals.brY}% ${vals.blY}%;`
    : `border-radius: ${vals.tl}% ${vals.tr}% ${vals.br}% ${vals.bl}%;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Controls */}
      <div className="flex-[1.2] flex flex-col gap-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#111827]">Radius Settings</h3>
          <button onClick={generateRandom} className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors" title="Randomize Blob">
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#374151] block mb-2">Mode</label>
          <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
            <button onClick={() => setMode('simple')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'simple' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}>Standard</button>
            <button onClick={() => setMode('advanced')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'advanced' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}>Fancy (8-Point)</button>
          </div>
        </div>

        <div className="space-y-6 mt-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-5">
              <h4 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wider">{mode === 'advanced' ? 'Horizontal (X)' : 'Corners'}</h4>
              {[
                { label: 'Top Left', k: 'tl' },
                { label: 'Top Right', k: 'tr' },
                { label: 'Bottom Right', k: 'br' },
                { label: 'Bottom Left', k: 'bl' }
              ].map(ctrl => (
                <div key={ctrl.k}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[#374151]">{ctrl.label}</span>
                    <span className="text-[13px] font-medium text-[#6B7280]">{vals[ctrl.k as keyof typeof vals]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={vals[ctrl.k as keyof typeof vals]} onChange={e => updateVal(ctrl.k as keyof typeof vals, parseInt(e.target.value))} className="w-full accent-[#111827]" />
                </div>
              ))}
            </div>

            {mode === 'advanced' && (
              <div className="space-y-5">
                <h4 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vertical (Y)</h4>
                {[
                  { label: 'Top Left Y', k: 'tlY' },
                  { label: 'Top Right Y', k: 'trY' },
                  { label: 'Bottom Right Y', k: 'brY' },
                  { label: 'Bottom Left Y', k: 'blY' }
                ].map(ctrl => (
                  <div key={ctrl.k}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] font-semibold text-[#374151]">{ctrl.label}</span>
                      <span className="text-[13px] font-medium text-[#6B7280]">{vals[ctrl.k as keyof typeof vals]}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={vals[ctrl.k as keyof typeof vals]} onChange={e => updateVal(ctrl.k as keyof typeof vals, parseInt(e.target.value))} className="w-full accent-[#111827]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Preview & Code */}
      <div className="flex-[1] flex flex-col gap-6">
        <div className="flex-1 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl border border-[#E5E7EB] min-h-[350px] flex items-center justify-center p-8 overflow-hidden relative radial-bg">
          {/* Subtle dotted background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          
          {/* Blob Preview */}
          <div 
            className="w-56 h-56 bg-white z-10 flex items-center justify-center transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-gradient-to-tr from-white to-[#F3F4F6]"
            style={{ 
              borderRadius: mode === 'advanced' 
                ? `${vals.tl}% ${vals.tr}% ${vals.br}% ${vals.bl}% / ${vals.tlY}% ${vals.trY}% ${vals.brY}% ${vals.blY}%`
                : `${vals.tl}% ${vals.tr}% ${vals.br}% ${vals.bl}%`
            }}
          >
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl p-4 shadow-sm relative group">
           <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">CSS Output</span>
           <code className="text-[#A7F3D0] font-mono text-[13px] break-words block pr-12">
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
