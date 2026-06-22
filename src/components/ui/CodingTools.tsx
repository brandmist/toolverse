import { useState } from 'react'
import { Button } from './button'
import { Code2 } from 'lucide-react'
import { CopyButton } from './ToolLayout'

// ── Coding Tools ─────────────────────────────────────────────────────────────

export function HtmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  
  const formatHTML = () => {
    // Basic regex-based beautifier
    let tab = 0;
    let text = input.replace(/\n/g, '').replace(/[\s\t]+/g, ' ');
    text = text.replace(/></g, '>\n<');
    const lines = text.split('\n');
    let result = '';
    
    lines.forEach((line) => {
      line = line.trim();
      const isClosing = line.match(/^<\//);
      const isSelfClosing = line.match(/\/>$/) || line.match(/^<(input|img|br|hr|meta|link)/);
      if (isClosing) tab--;
      result += '  '.repeat(Math.max(0, tab)) + line + '\n';
      const isOpening = line.match(/^<[a-zA-Z]/) && !isClosing && !isSelfClosing;
      if (isOpening) tab++;
    })
    
    setOutput(result.trim());
  }

  return (
    <div className="tool-panel">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="tool-label" htmlFor="html-input">Minified HTML</label>
          <textarea
            id="html-input"
            className="min-h-[400px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<div><span>minified</span></div>"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="tool-label">Formatted HTML</label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            className="min-h-[400px] font-mono"
            value={output}
            placeholder="Formatted output will appear here"
          />
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <Button size="lg" className="min-w-[200px]" onClick={formatHTML}>
           <Code2 className="w-5 h-5 mr-2" /> Format HTML
        </Button>
      </div>
    </div>
  )
}

export function JwtDecoder() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')

  const decodeJwt = (t: string) => {
    setToken(t)
    setError('')
    setHeader('')
    setPayload('')
    
    if (!t) return
    
    const parts = t.split('.')
    if (parts.length < 2) {
      setError('Invalid JWT Format')
      return;
    }
    
    try {
      const decodedHeader = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))
      const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2))
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2))
    } catch(err) {
      setError('Failed to decode JWT')
    }
  }

  return (
    <div className="tool-panel">
       <div className="flex flex-col gap-2">
         <div className="flex justify-between items-center">
            <label className="tool-label" htmlFor="jwt-input">JWT String</label>
            <CopyButton text={token} />
         </div>
         <textarea
            id="jwt-input"
            className="min-h-[140px] font-mono break-all"
            value={token}
            onChange={(e) => decodeJwt(e.target.value)}
            placeholder="ey..."
          />
          {error && <span className="text-danger text-[13px] font-medium">{error}</span>}
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="tool-label">Header (Algorithm & Type)</label>
              <CopyButton text={header} />
            </div>
            <textarea
              readOnly
              className="min-h-[300px] font-mono"
              value={header}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-semibold text-[#059669] mb-[6px] tracking-[0.01em]">Payload (Data)</label>
              <CopyButton text={payload} />
            </div>
            <textarea
              readOnly
              className="min-h-[300px] font-mono !text-[#059669]"
              value={payload}
            />
          </div>
       </div>
    </div>
  )
}
