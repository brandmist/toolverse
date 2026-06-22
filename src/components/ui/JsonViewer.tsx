import { useState } from 'react'

export function JsonViewer() {
  const [text, setText] = useState('{\n  "name": "ToolVerse",\n  "awesome": true\n}')
  const [parsed, setParsed] = useState<any>({ name: 'ToolVerse', awesome: true })
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      const obj = JSON.parse(text)
      setParsed(obj)
      setText(JSON.stringify(obj, null, 2))
      setError('')
    } catch (err: any) {
      setError(err.message)
      setParsed(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <textarea
        className="w-full flex-grow min-h-[250px] p-4 bg-card border border-border border-white/10 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-text-primary font-mono text-sm leading-relaxed"
        placeholder="Paste JSON here..."
        value={text}
        onChange={(e) => { setText(e.target.value); setError(''); }}
        onBlur={handleFormat}
      />
      {error && <div className="text-danger text-sm px-4 py-3 bg-surface border border-border rounded-xl border border-border font-medium">{error}</div>}
      {!error && parsed && <div className="text-success text-sm px-4 py-3 bg-surface border border-border rounded-xl border border-border font-medium">Valid JSON</div>}
    </div>
  )
}
