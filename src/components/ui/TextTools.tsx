import { useState, useMemo } from 'react'
import { Check } from 'lucide-react'
import { TabBar, StatChip, CopyButton } from './ToolLayout'

// ── Text Reverser ─────────────────────────────────────────────────────────────
export function TextReverser() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars')

  const output = useMemo(() => {
    if (!input) return ''
    switch (mode) {
      case 'chars': return input.split('').reverse().join('')
      case 'words': return input.split(/(\s+)/).reverse().join('')
      case 'lines': return input.split('\n').reverse().join('\n')
      default: return input
    }
  }, [input, mode])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TabBar options={['chars', 'words', 'lines']} value={mode} onChange={setMode} />
        <div className="flex gap-3 flex-wrap">
          <StatChip label="chars" value={input.length} />
          <StatChip label="words" value={input.trim() ? input.trim().split(/\s+/).length : 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="tool-label" htmlFor="reverser-input">Input Text</label>
          </div>
          <textarea
            id="reverser-input"
            className="min-h-[220px]"
            placeholder="Type or paste text to reverse…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="tool-label">Reversed Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            className="min-h-[220px] font-mono"
            placeholder="Result appears here…"
            value={output}
          />
        </div>
      </div>
    </div>
  )
}

// ── Duplicate Line Remover ────────────────────────────────────────────────────
export function DuplicateRemover() {
  const [input, setInput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimLines, setTrimLines] = useState(true)

  const output = useMemo(() => {
    const lines = input.split('\n')
    const seen = new Set<string>()
    return lines.filter(line => {
      const key = trimLines
        ? (caseSensitive ? line.trim() : line.trim().toLowerCase())
        : (caseSensitive ? line : line.toLowerCase())
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).join('\n')
  }, [input, caseSensitive, trimLines])

  const duplicatesRemoved = input.split('\n').length - output.split('\n').length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-3 cursor-pointer text-[14px] text-[#374151] font-medium select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Case Sensitive
        </label>
        <label className="flex items-center gap-3 cursor-pointer text-[14px] text-[#374151] font-medium select-none">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={e => setTrimLines(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Trim Whitespace
        </label>
        {duplicatesRemoved > 0 && (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-3 py-1">
            <Check className="w-3.5 h-3.5" />
            {duplicatesRemoved} duplicate{duplicatesRemoved > 1 ? 's' : ''} removed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="tool-label" htmlFor="dedup-input">Input (one item per line)</label>
          <textarea
            id="dedup-input"
            className="min-h-[220px] font-mono"
            placeholder={"apple\nbanana\napple\ncherry\nbanana"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="tool-label">Deduplicated Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            className="min-h-[220px] font-mono"
            placeholder="Unique lines will appear here…"
            value={output}
          />
        </div>
      </div>
    </div>
  )
}

// ── Text Diff Checker ─────────────────────────────────────────────────────────
export function TextDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const computeDiff = () => {
    const lLines = left.split('\n')
    const rLines = right.split('\n')
    const maxLen = Math.max(lLines.length, rLines.length)
    const result: { left: string; right: string; type: 'same' | 'changed' | 'added' | 'removed' }[] = []

    for (let i = 0; i < maxLen; i++) {
      const l = lLines[i] ?? null
      const r = rLines[i] ?? null
      if (l === r) result.push({ left: l!, right: r!, type: 'same' })
      else if (l === null) result.push({ left: '', right: r!, type: 'added' })
      else if (r === null) result.push({ left: l, right: '', type: 'removed' })
      else result.push({ left: l, right: r, type: 'changed' })
    }
    return result
  }

  const diff = computeDiff()
  const changedCount = diff.filter(d => d.type !== 'same').length

  const rowBg: Record<string, string> = {
    same: '',
    changed: 'bg-[#FFFBEB]',
    added:   'bg-[#ECFDF5]',
    removed: 'bg-[#FEF2F2]',
  }
  const rowTextL: Record<string, string> = {
    same:    'text-[#374151]',
    changed: 'text-[#D97706]',
    added:   'text-[#6B7280]',
    removed: 'text-[#DC2626]',
  }
  const rowTextR: Record<string, string> = {
    same:    'text-[#374151]',
    changed: 'text-[#D97706]',
    added:   'text-[#059669]',
    removed: 'text-[#6B7280]',
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[13px] text-[#6B7280]">Paste two texts to see differences highlighted line by line.</span>
        {changedCount > 0 && (
          <span className="inline-flex items-center text-[13px] font-semibold text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-1">
            {changedCount} difference{changedCount > 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="tool-label" htmlFor="diff-left">Original Text</label>
          <textarea
            id="diff-left"
            className="min-h-[180px] font-mono"
            placeholder="Paste original text…"
            value={left}
            onChange={e => setLeft(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="tool-label" htmlFor="diff-right">Modified Text</label>
          <textarea
            id="diff-right"
            className="min-h-[180px] font-mono"
            placeholder="Paste modified text…"
            value={right}
            onChange={e => setRight(e.target.value)}
          />
        </div>
      </div>

      {(left || right) && (
        <div className="border border-[#E5E7EB] rounded-xl overflow-auto max-h-[320px] bg-white">
          <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] text-xs font-mono">
            <div>
              <div className="sticky top-0 px-3 py-2 bg-[#FAFAFA] border-b border-[#E5E7EB] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Original
              </div>
              {diff.map((row, i) => (
                <div key={i} className={`px-3 py-0.5 leading-5 ${rowBg[row.type]}`}>
                  <span className={rowTextL[row.type]}>{row.left || '\u00A0'}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="sticky top-0 px-3 py-2 bg-[#FAFAFA] border-b border-[#E5E7EB] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Modified
              </div>
              {diff.map((row, i) => (
                <div key={i} className={`px-3 py-0.5 leading-5 ${rowBg[row.type]}`}>
                  <span className={rowTextR[row.type]}>{row.right || '\u00A0'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
