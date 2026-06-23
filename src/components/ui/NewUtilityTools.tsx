import { useState, useMemo } from 'react'
import { Button } from './button'
import { Copy } from 'lucide-react'

// Number Base Converter
export function NumberBaseConverter() {
  const [input, setInput] = useState('255')
  const [fromBase, setFromBase] = useState(10)

  const convert = (val: string, from: number) => {
    try {
      const decimal = parseInt(val, from)
      if (isNaN(decimal)) return null
      return {
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
      }
    } catch {
      return null
    }
  }

  const result = useMemo(() => convert(input, fromBase), [input, fromBase])

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label className="text-sm text-[#111827] block mb-2">Input Value</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="Enter a number..."
          />
        </div>
        <div>
          <label className="text-sm text-[#111827] block mb-2">Input Base</label>
          <div className="flex gap-2">
            {[{ label: 'BIN', base: 2 }, { label: 'OCT', base: 8 }, { label: 'DEC', base: 10 }, { label: 'HEX', base: 16 }].map(({ label, base }) => (
              <button key={base} onClick={() => setFromBase(base)} className={`px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${fromBase === base ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
          {[
            { label: 'Binary (Base 2)', value: result.binary, prefix: '0b' },
            { label: 'Octal (Base 8)', value: result.octal, prefix: '0o' },
            { label: 'Decimal (Base 10)', value: result.decimal, prefix: '' },
            { label: 'Hexadecimal (Base 16)', value: result.hex, prefix: '0x' },
          ].map(({ label, value, prefix }) => (
            <div key={label} className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-5 group cursor-pointer hover:border-[#E5E7EB] transition-colors" onClick={() => navigator.clipboard.writeText(value)}>
              <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">{label}</div>
              <div className="font-mono text-success text-xl font-bold break-all">{prefix}{value}</div>
              <div className="text-xs text-[#111827] mt-2 group-hover:text-[#6B7280] transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Click to copy</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-grow text-danger text-sm">
          Invalid number for base {fromBase}. Please enter a valid value.
        </div>
      )}
    </div>
  )
}

// Regex Tester
export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('The quick brown fox jumps over the lazy dog. fox@example.com')
  const [error, setError] = useState('')

  const result = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testString, count: 0 }
    try {
      setError('')
      const regex = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups: string[] }[] = []
      let m: RegExpExecArray | null

      if (flags.includes('g')) {
        while ((m = regex.exec(testString)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: Array.from(m).slice(1) })
          if (m.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        m = regex.exec(testString)
        if (m) matches.push({ match: m[0], index: m.index, groups: Array.from(m).slice(1) })
      }

      // Build highlighted HTML
      let highlighted = ''
      let lastIndex = 0
      const allMatches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
      for (const match of allMatches) {
        const matchIndex = match.index ?? 0
        highlighted += testString.slice(lastIndex, matchIndex).replace(/</g, '&lt;')
        highlighted += `<mark class="bg-[#FAFAFA] border border-[#E5E7EB] text-warning rounded px-0.5">${match[0].replace(/</g, '&lt;')}</mark>`
        lastIndex = matchIndex + match[0].length
      }
      highlighted += testString.slice(lastIndex).replace(/</g, '&lt;')

      return { matches, highlighted, count: matches.length }
    } catch (e: any) {
      setError(e.message)
      return { matches: [], highlighted: testString, count: 0 }
    }
  }, [pattern, flags, testString])

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex gap-2 items-end">
        <div className="flex-grow">
          <label className="text-sm text-[#111827] block mb-2">Regular Expression</label>
          <div className="flex items-center bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-3 gap-2 focus-within:border-[#E5E7EB] transition-colors">
            <span className="text-[#6B7280] font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className="flex-grow bg-transparent text-[#111827] font-mono focus:outline-none"
              placeholder="pattern..."
            />
            <span className="text-[#6B7280] font-mono">/</span>
            <input
              type="text"
              value={flags}
              onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              className="w-14 bg-transparent text-success font-mono focus:outline-none text-sm"
              placeholder="gim"
            />
          </div>
        </div>
        {result.count > 0 && !error && (
          <div className="px-4 py-3 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl text-success text-sm font-medium whitespace-nowrap">
            {result.count} match{result.count !== 1 ? 'es' : ''}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl text-danger text-xs max-w-xs truncate">
            {error}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-[#111827] block mb-2">Test String</label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          rows={4}
          className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-[#111827] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div>
        <label className="text-sm text-[#111827] block mb-2">Highlighted Matches</label>
        <div
          className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-[#111827] font-mono text-sm min-h-[80px] whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: result.highlighted }}
        />
      </div>

      {result.matches.length > 0 && (
        <div>
          <label className="text-sm text-[#111827] block mb-2">Match Details</label>
          <div className="space-y-1 max-h-36 overflow-auto">
            {result.matches.map((m, i) => (
              <div key={i} className="flex gap-3 items-center text-xs bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-3 py-2">
                <span className="text-[#6B7280] w-5 text-center font-bold">{i + 1}</span>
                <span className="font-mono text-warning font-bold">{m.match || '(empty)'}</span>
                <span className="text-[#6B7280]">at index {m.index}</span>
                {m.groups.filter(Boolean).length > 0 && (
                  <span className="text-success">groups: [{m.groups.join(', ')}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Word Frequency Counter
export function WordFrequency() {
  const [text, setText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [minLength, setMinLength] = useState(2)

  const stats = useMemo(() => {
    if (!text) return { words: [], totalWords: 0, uniqueWords: 0 }
    const raw = caseSensitive ? text : text.toLowerCase()
    const words = raw.match(/\b[a-zA-Z']+\b/g) || []
    const filtered = words.filter(w => w.length >= minLength)
    const freq: Record<string, number> = {}
    for (const w of filtered) freq[w] = (freq[w] || 0) + 1
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 50)
    return { words: sorted, totalWords: filtered.length, uniqueWords: Object.keys(freq).length }
  }, [text, caseSensitive, minLength])

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-sm text-[#111827] block mb-2">Input Text</label>
          <textarea
            className="w-full h-56 p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="Paste your text here to analyze word frequency..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[#111827]">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="w-4 h-4 rounded bg-white border border-[#E5E7EB] accent-indigo-500" />
            Case Sensitive
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#111827]">Min length:</span>
            <input type="number" min="1" max="10" value={minLength} onChange={e => setMinLength(parseInt(e.target.value) || 1)} className="w-16 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-2 py-1 text-[#111827] text-sm" />
          </div>
        </div>
        {text && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#111827]">{stats.totalWords}</div>
              <div className="text-xs text-[#6B7280] mt-1">Total Words</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats.uniqueWords}</div>
              <div className="text-xs text-[#6B7280] mt-1">Unique Words</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-sm text-[#111827] block mb-2">Word Frequency (Top 50)</label>
        <div className="flex-grow bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl overflow-auto max-h-[500px]">
          {stats.words.length > 0 ? (
            <div className="p-3 space-y-1">
              {stats.words.map(([word, count], i) => (
                <div key={word} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors">
                  <span className="text-[#111827] text-xs w-6 text-right">{i + 1}</span>
                  <span className="flex-grow text-[#111827] font-medium">{word}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-full overflow-hidden w-24">
                      <div className="h-full bg-white border border-[#E5E7EB] rounded-full" style={{ width: `${(count / stats.words[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-[#111827] text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6B7280] text-sm">
              {text ? 'No words found with minimum length ' + minLength : 'Paste some text to see word frequency'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// JSON to CSV Converter
export function JsonToCsv() {
  const [input, setInput] = useState('[\n  {"name": "Alice", "age": 30, "city": "New York"},\n  {"name": "Bob", "age": 25, "city": "London"},\n  {"name": "Charlie", "age": 35, "city": "Tokyo"}\n]')
  const [error, setError] = useState('')

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try {
      setError('')
      const data = JSON.parse(input)
      if (!Array.isArray(data)) throw new Error('JSON must be an array of objects')
      if (data.length === 0) return ''

      const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
      const escape = (val: any) => {
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }

      const rows = data.map(row => headers.map(h => escape(row[h])).join(','))
      return [headers.join(','), ...rows].join('\n')
    } catch (e: any) {
      setError(e.message)
      return ''
    }
  }, [input])

  const downloadCsv = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-[350px]">
        <div className="flex flex-col">
          <label className="text-sm text-[#111827] mb-2">JSON Input (Array of Objects)</label>
          <textarea
            className="flex-grow p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-[#111827] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='[{"key": "value"}]'
          />
          {error && <p className="text-danger text-xs mt-2">{error}</p>}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-[#111827]">CSV Output</label>
            <div className="flex gap-2">
              {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>}
            </div>
          </div>
          <textarea
            readOnly
            className="flex-grow p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-success font-mono text-sm"
            value={output}
            placeholder="CSV output will appear here..."
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={downloadCsv} disabled={!output}>
          Download CSV
        </Button>
      </div>
    </div>
  )
}
