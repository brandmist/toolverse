import { useState, useMemo } from 'react'
import { Button } from './button'
import { Copy } from 'lucide-react'

// JSON Minifier
export function JsonMinifier() {
  const [input, setInput] = useState('{\n  "name": "ToolVerse",\n  "version": "1.0.0",\n  "description": "Browser-based tools collection"\n}')
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
  const [tl, setTl] = useState(30)
  const [tr, setTr] = useState(70)
  const [br, setBr] = useState(30)
  const [bl, setBl] = useState(70)

  const css = `border-radius: ${tl}% ${tr}% ${br}% ${bl}%;`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 space-y-4">
        {[
          { label: 'Top Left', val: tl, set: setTl },
          { label: 'Top Right', val: tr, set: setTr },
          { label: 'Bottom Right', val: br, set: setBr },
          { label: 'Bottom Left', val: bl, set: setBl },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-text-primary">{label}</span>
              <span className="text-sm text-text-muted">{val}%</span>
            </div>
            <input type="range" min="0" max="100" value={val} onChange={e => set(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
        <div className="pt-2">
          <span className="text-xs text-text-muted mb-2 block font-semibold uppercase">CSS Code</span>
          <div className="p-4 bg-surface border border-border border-white/10 rounded-xl text-success font-mono text-sm cursor-pointer hover:bg-card border border-border transition-colors" onClick={() => navigator.clipboard.writeText(css)}>
            {css}
          </div>
          <Button variant="outline" className="w-full mt-2 border-white/10 hover:bg-white/10 text-text-primary" onClick={() => navigator.clipboard.writeText(css)}>
            <Copy className="w-4 h-4 mr-2" /> Copy CSS
          </Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-surface border border-border rounded-xl border border-white/5 min-h-[300px]">
        <div
          className="w-60 h-60 transition-all duration-300 shadow-2xl shadow-indigo-500/20"
          style={{ borderRadius: `${tl}% ${tr}% ${br}% ${bl}%` }}
        />
      </div>
    </div>
  )
}
