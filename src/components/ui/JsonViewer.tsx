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
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[250px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm leading-relaxed"
        placeholder="Paste JSON here..."
        value={text}
        onChange={(e) => { setText(e.target.value); setError(''); }}
        onBlur={handleFormat}
      />
      {error && <div className="text-danger text-sm px-4 py-3 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] font-medium">{error}</div>}
      {!error && parsed && <div className="text-success text-sm px-4 py-3 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] font-medium">Valid JSON</div>}
    </div>
  )
}
