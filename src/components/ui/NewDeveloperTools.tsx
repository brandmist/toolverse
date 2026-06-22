import React, { useState, useEffect } from 'react'
import { CheckCircle, Copy, AlertCircle, RefreshCw, Info, Code, Palette, Clock, FileText } from 'lucide-react'
import { Button } from './button'

/* ─────────── 1. RegEx Explainer & Visualizer ─────────── */
export function RegExExplainer() {
  const [regexStr, setRegexStr] = useState('^([a-zA-Z0-9._%-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,6})$')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('test@example.com')
  const [explanation, setExplanation] = useState<{ token: string; desc: string }[]>([])
  const [isMatch, setIsMatch] = useState(false)

  const parseRegex = () => {
    try {
      const parsed: typeof explanation = []
      
      if (regexStr.startsWith('^')) {
        parsed.push({ token: '^', desc: 'Asserts start of line/string boundary' })
      }
      
      const captureGroups = regexStr.match(/\([^)]+\)/g) || []
      captureGroups.forEach((group, index) => {
        parsed.push({ token: group, desc: `Capture Group #${index + 1}: Matches group pattern match` })
      })

      const charClasses = regexStr.match(/\[[^\]]+\]/g) || []
      charClasses.forEach(cls => {
        parsed.push({ token: cls, desc: `Character Set: Match any characters inside this range` })
      })

      if (regexStr.endsWith('$')) {
        parsed.push({ token: '$', desc: 'Asserts end of line/string boundary' })
      }
      
      if (parsed.length === 0) {
        parsed.push({ token: regexStr, desc: 'Literal string or basic pattern match' })
      }
      
      setExplanation(parsed)
      
      const r = new RegExp(regexStr, flags)
      setIsMatch(r.test(testStr))
    } catch (e) {
      setExplanation([{ token: 'Error', desc: 'Invalid regular expression syntax' }])
      setIsMatch(false)
    }
  }

  useEffect(() => { parseRegex() }, [regexStr, flags, testStr])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-text-muted block mb-1">Regular Expression</label>
            <div className="flex gap-2">
              <input type="text" value={regexStr} onChange={e => setRegexStr(e.target.value)} className="w-full bg-card border border-border border-white/10 rounded-xl px-4 py-2.5 text-text-primary font-mono text-sm" />
              <input type="text" value={flags} onChange={e => setFlags(e.target.value)} placeholder="flags" className="w-20 bg-card border border-border border-white/10 rounded-xl px-3 py-2.5 text-text-primary font-mono text-sm text-center" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">Test String</label>
            <textarea value={testStr} onChange={e => setTestStr(e.target.value)} className="w-full h-24 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-text-primary resize-none" />
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${isMatch ? 'bg-surface border border-border border-border text-success' : 'bg-surface border border-border border-border text-danger'}`}>
            {isMatch ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-semibold">{isMatch ? 'Match Found!' : 'No Match'}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">RegEx Breakdown</h4>
          <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
            {explanation.map((item, idx) => (
              <div key={idx} className="bg-surface border border-border border-white/5 rounded-lg p-2.5 flex flex-col gap-1">
                <span className="font-mono text-xs text-text-primary font-bold bg-surface border border-border px-2 py-0.5 rounded w-max">{item.token}</span>
                <span className="text-xs text-text-primary">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── 2. HTML ⇄ Markdown Converter ─────────── */
export function HtmlMarkdown() {
  const [input, setInput] = useState('<h1>Hello World</h1>\n<p>This is a <strong>rich text paragraph</strong> converted online.</p>')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'h2m' | 'm2h'>('h2m')

  const convert = () => {
    if (mode === 'h2m') {
      let md = input
        .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<a href="([^"]+)">(.*?)<\/a>/gi, '[$2]($1)')
      setOutput(md)
    } else {
      let html = input
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .split('\n\n').map(line => line.trim() && !line.startsWith('<h') ? `<p>${line}</p>` : line).join('\n')
      setOutput(html)
    }
  }

  useEffect(() => { convert() }, [input, mode])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex gap-2">
        <button onClick={() => { setMode('h2m'); setInput('<h1>Hello World</h1>\n<p>This is a <strong>rich text paragraph</strong>.</p>') }} className={`py-1.5 px-4 rounded-lg text-xs font-bold ${mode === 'h2m' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>HTML → Markdown</button>
        <button onClick={() => { setMode('m2h'); setInput('# Hello World\n\nThis is a **rich text paragraph**.') }} className={`py-1.5 px-4 rounded-lg text-xs font-bold ${mode === 'm2h' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Markdown → HTML</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-muted block mb-1">Source Code</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-text-primary resize-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-text-muted block">Converted Code</label>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
          <textarea readOnly value={output} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-success resize-none" />
        </div>
      </div>
    </div>
  )
}

/* ─────────── 3. SQL Formatter ─────────── */
export function SqlFormatter() {
  const [sql, setSql] = useState("select id, name, email from users where active = 1 group by department order by created_at desc")
  const [formatted, setFormatted] = useState('')

  const formatSql = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'UPDATE', 'INSERT INTO', 'VALUES', 'SET']
    
    // Capitalize and insert breaklines
    let temp = sql.replace(/\s+/g, ' ')
    
    keywords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      temp = temp.replace(regex, `\n${word}`)
    })
    
    setFormatted(temp.trim())
  }

  useEffect(() => { formatSql() }, [sql])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-muted block mb-1">Raw Query</label>
          <textarea value={sql} onChange={e => setSql(e.target.value)} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-text-primary resize-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-text-muted block">Prettified SQL</label>
            <button onClick={() => navigator.clipboard.writeText(formatted)} className="text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
          <textarea readOnly value={formatted} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-success resize-none" />
        </div>
      </div>
    </div>
  )
}

/* ─────────── 4. WCAG Color Contrast Checker ─────────── */
export function ColorContrast() {
  const [bg, setBg] = useState('#1e1b4b')
  const [text, setText] = useState('#e0e7ff')
  const [ratio, setRatio] = useState(0)

  const hexToRgb = (hex: string) => {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const full = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  const calculateContrast = () => {
    const rgb1 = hexToRgb(bg)
    const rgb2 = hexToRgb(text)
    const l1 = getLuminance(rgb1)
    const l2 = getLuminance(rgb2)
    const brightest = Math.max(l1, l2)
    const darkest = Math.min(l1, l2)
    const res = (brightest + 0.05) / (darkest + 0.05)
    setRatio(parseFloat(res.toFixed(2)))
  }

  useEffect(() => { calculateContrast() }, [bg, text])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-surface border border-border p-4 rounded-xl border border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">Background Color</label>
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Text Color</label>
              <input type="color" value={text} onChange={e => setText(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
            </div>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-text-primary">WCAG 2.0 Compliance:</h4>
            <div className="space-y-2 mt-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-card border border-border border-white/5">
                <span>Normal Text AA (Contrast 4.5:1)</span>
                <span className={`font-bold ${ratio >= 4.5 ? 'text-success' : 'text-danger'}`}>{ratio >= 4.5 ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-card border border-border border-white/5">
                <span>Large Text AA (Contrast 3.0:1)</span>
                <span className={`font-bold ${ratio >= 3.0 ? 'text-success' : 'text-danger'}`}>{ratio >= 3.0 ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-card border border-border border-white/5">
                <span>Normal Text AAA (Contrast 7.0:1)</span>
                <span className={`font-bold ${ratio >= 7.0 ? 'text-success' : 'text-danger'}`}>{ratio >= 7.0 ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center p-6 rounded-xl border border-white/10" style={{ backgroundColor: bg }}>
          <span className="text-3xl font-extrabold mb-1" style={{ color: text }}>{ratio}:1</span>
          <span className="text-xs opacity-75 uppercase tracking-wider mb-4" style={{ color: text }}>Contrast Ratio</span>
          <p className="text-sm leading-relaxed text-center" style={{ color: text }}>
            This is a preview sentence showing how the font size looks on the selected background color.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────── 5. Unix Epoch Timestamp Converter ─────────── */
export function EpochConverter() {
  const [epoch, setEpoch] = useState(Math.round(Date.now() / 1000).toString())
  const [humanDate, setHumanDate] = useState('')
  const [calendarInput, setCalendarInput] = useState('')
  const [convertedEpoch, setConvertedEpoch] = useState('')

  const handleEpochConvert = () => {
    try {
      const num = parseInt(epoch)
      if (isNaN(num)) throw new Error()
      const date = new Date(num * 1000)
      setHumanDate(date.toUTCString())
    } catch {
      setHumanDate('Invalid Unix Timestamp')
    }
  }

  const handleCalendarConvert = () => {
    try {
      const date = new Date(calendarInput)
      if (isNaN(date.getTime())) throw new Error()
      setConvertedEpoch(Math.round(date.getTime() / 1000).toString())
    } catch {
      setConvertedEpoch('Invalid calendar input format')
    }
  }

  useEffect(() => { handleEpochConvert() }, [epoch])
  useEffect(() => { handleCalendarConvert() }, [calendarInput])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Epoch to Date */}
        <div className="bg-surface border border-border p-4 rounded-xl border border-white/5 space-y-4">
          <h4 className="text-sm font-semibold text-text-primary">Unix Timestamp → Calendar Date</h4>
          <div>
            <label className="text-xs text-text-muted block mb-1">Enter Timestamp (seconds)</label>
            <input type="text" value={epoch} onChange={e => setEpoch(e.target.value)} className="w-full bg-card border border-border border-white/10 rounded-xl px-4 py-2 text-text-primary font-mono text-sm" />
          </div>
          <div className="bg-card border border-border border-white/5 p-3 rounded-lg text-xs font-mono text-text-primary flex items-center gap-2">
            <Info className="w-4 h-4 text-text-muted shrink-0" />
            <span>UTC Date: {humanDate}</span>
          </div>
        </div>
        
        {/* Date to Epoch */}
        <div className="bg-surface border border-border p-4 rounded-xl border border-white/5 space-y-4">
          <h4 className="text-sm font-semibold text-text-primary">Calendar Date → Unix Timestamp</h4>
          <div>
            <label className="text-xs text-text-muted block mb-1">Enter ISO/GMT Format Date</label>
            <input type="text" value={calendarInput} placeholder="e.g. 2026-06-20T12:00:00" onChange={e => setCalendarInput(e.target.value)} className="w-full bg-card border border-border border-white/10 rounded-xl px-4 py-2 text-text-primary font-mono text-sm" />
          </div>
          <div className="bg-card border border-border border-white/5 p-3 rounded-lg text-xs font-mono text-success flex items-center gap-2">
            <Info className="w-4 h-4 text-text-muted shrink-0" />
            <span>Epoch Value: {convertedEpoch}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── 6. CSV ⇄ JSON ⇄ YAML Converter ─────────── */
export function CsvJsonYaml() {
  const [inputText, setInputText] = useState('[\n  {"id": 1, "name": "John Doe"},\n  {"id": 2, "name": "Jane Smith"}\n]')
  const [outputFormat, setOutputFormat] = useState<'csv' | 'json' | 'yaml'>('csv')
  const [outputText, setOutputText] = useState('')

  const convert = () => {
    try {
      if (!inputText.trim()) { setOutputText(''); return }
      
      // Attempt to parse input text to JSON object array
      let jsonArray: any[] = []
      
      if (inputText.trim().startsWith('[')) {
        jsonArray = JSON.parse(inputText)
      } else if (inputText.trim().includes('\n') && inputText.includes(',')) {
        // Simple CSV parser
        const lines = inputText.trim().split('\n')
        const headers = lines[0].split(',')
        jsonArray = lines.slice(1).map(line => {
          const vals = line.split(',')
          const obj: any = {}
          headers.forEach((h, i) => {
            obj[h.trim()] = vals[i]?.trim()
          })
          return obj
        })
      } else {
        // Assume basic key-value YAML format
        const lines = inputText.trim().split('\n')
        const obj: any = {}
        lines.forEach(line => {
          const parts = line.split(':')
          if (parts.length >= 2) {
            obj[parts[0].trim()] = parts.slice(1).join(':').trim()
          }
        })
        jsonArray = [obj]
      }
      
      // Output generation
      if (outputFormat === 'json') {
        setOutputText(JSON.stringify(jsonArray, null, 2))
      }
      else if (outputFormat === 'csv') {
        if (jsonArray.length === 0) { setOutputText(''); return }
        const headers = Object.keys(jsonArray[0])
        const csvLines = [
          headers.join(','),
          ...jsonArray.map(item => headers.map(h => item[h]).join(','))
        ]
        setOutputText(csvLines.join('\n'))
      }
      else if (outputFormat === 'yaml') {
        const yamlLines = jsonArray.map(item => 
          Object.entries(item).map(([k, v]) => `${k}: ${v}`).join('\n')
        )
        setOutputText(yamlLines.join('\n---\n'))
      }
    } catch {
      setOutputText('Parsing/conversion syntax error. Verify your source syntax.')
    }
  }

  useEffect(() => { convert() }, [inputText, outputFormat])

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex gap-2">
        <button onClick={() => setOutputFormat('csv')} className={`py-1.5 px-4 rounded-lg text-xs font-bold ${outputFormat === 'csv' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Export to CSV</button>
        <button onClick={() => setOutputFormat('json')} className={`py-1.5 px-4 rounded-lg text-xs font-bold ${outputFormat === 'json' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Export to JSON</button>
        <button onClick={() => setOutputFormat('yaml')} className={`py-1.5 px-4 rounded-lg text-xs font-bold ${outputFormat === 'yaml' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Export to YAML</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-muted block mb-1">Source (Autodetects format)</label>
          <textarea value={inputText} onChange={e => setInputText(e.target.value)} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-text-primary resize-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-text-muted block">Export Output</label>
            <button onClick={() => navigator.clipboard.writeText(outputText)} className="text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
          <textarea readOnly value={outputText} className="w-full h-64 p-3 bg-card border border-border border-white/10 rounded-xl font-mono text-xs text-success resize-none" />
        </div>
      </div>
    </div>
  )
}
