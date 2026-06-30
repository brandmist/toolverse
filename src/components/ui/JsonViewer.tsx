import { useState } from 'react'

export function JsonViewer() {
  const [text, setText] = useState('{\n  "name": "SmarTools",\n  "awesome": true\n}')
  const [parsed, setParsed] = useState<any>({ name: 'SmarTools', awesome: true })
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
    <div className="flex flex-col h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[250px] p-4 bg-white border border-border border-border rounded-xl mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-text-primary text-primary font-mono text-sm leading-relaxed"
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
