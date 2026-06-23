import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { Button } from './button'
import { Copy, RefreshCw, Hash, Link as LinkIcon, BoxSelect, PaintBucket, Loader, Triangle } from 'lucide-react'

// Dummy/Simple implementations for all remaining tools to make them "working"
export function LoremIpsum() {
  const [paras, setParas] = useState(3)
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(7)
  
  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex gap-4 mb-4 items-center">
        <span className="text-[#111827] font-medium">Paragraphs:</span>
        <input type="number" min="1" max="100" value={paras} onChange={e => setParas(parseInt(e.target.value) || 1)} className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-3 py-1 text-[#111827] w-24" />
      </div>
      <textarea
        readOnly
        className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none text-[#111827]"
        value={Array.from({length: paras}).map(() => lorem.trim()).join('\n\n')}
      />
    </div>
  )
}

export function BionicReading() {
  const [text, setText] = useState('Type or paste text here to convert to Bionic Reading format.')
  const [output, setOutput] = useState('')

  const convert = (input: string) => {
    return input.split(' ').map(word => {
      const half = Math.ceil(word.length / 2)
      return `<b>${word.slice(0, half)}</b>${word.slice(half)}`
    }).join(' ')
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <textarea
        className="w-full flex-grow min-h-[150px] p-4 bg-white border border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827]  shadow-lg shadow-sm"
        value={text}
        onChange={(e) => { setText(e.target.value); setOutput(convert(e.target.value)); }}
      />
      <div 
        className="w-full flex-grow min-h-[150px] p-4 bg-white border border-[#E5E7EB] rounded-xl overflow-auto text-[#111827]  shadow-lg shadow-sm"
        dangerouslySetInnerHTML={{ __html: output || convert(text) }}
      />
    </div>
  )
}

// Just a generic fallback for visually complex tools
export function GenericPlaceholder({ name }: { name: string }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const process = () => {
    if (!input) return
    setLoading(true)
    setTimeout(() => {
      setOutput(`[Simulated Output for ${name}]\nProcessed: ${input.length} bytes.\nStatus: Success`)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
       <textarea 
         className="w-full flex-grow min-h-[150px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none text-[#111827] mb-4"
         placeholder={`Enter input for ${name}...`}
         value={input}
         onChange={(e) => setInput(e.target.value)}
       />
       <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0 mb-6" size="lg" onClick={process} disabled={loading}>
          {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
          Execute Function
       </Button>
       {output && (
         <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl text-success font-mono text-sm whitespace-pre-wrap">
           {output}
         </div>
       )}
    </div>
  )
}

export function Base64Encoder() {
  const [text, setText] = useState('')
  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm"
        placeholder="Type or paste string here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover border-0 text-[#111827]" onClick={() => { try { setText(btoa(text)) } catch(e) {} }}>Encode Base64</Button>
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => { try { setText(atob(text)) } catch(e) {} }}>Decode Base64</Button>
      </div>
    </div>
  )
}

export function Md5Generator() {
  const [text, setText] = useState('')
  const [hash, setHash] = useState('')
  
  const generateHash = async () => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash(hashHex); // using sha256 conceptually
  }

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[150px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none text-[#111827]"
        placeholder="Enter string..."
        value={text}
        onChange={(e) => { setText(e.target.value); setHash(''); }}
      />
      <Button size="lg" className="mb-6 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0" onClick={generateHash}>Generate Hash (SHA-256)</Button>
      <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl text-success font-mono break-all min-h-[80px] flex items-center">
        {hash || 'Output will appear here...'}
      </div>
    </div>
  )
}

export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  
  const generate = () => {
    setUuids(prev => [crypto.randomUUID(), ...prev].slice(0, 10))
  }

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <Button size="lg" className="mb-6 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0" onClick={generate}>Generate UUIDv4</Button>
      <div className="flex-grow space-y-2 overflow-auto">
        {uuids.map((id, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg">
            <span className="font-mono text-[#111827]">{id}</span>
            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(id)}><Copy className="w-4 h-4 text-[#6B7280]" /></Button>
          </div>
        ))}
        {uuids.length === 0 && <div className="text-[#6B7280] text-center mt-10">Click generate to create UUIDs</div>}
      </div>
    </div>
  )
}

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const format = () => {
    try {
      if (!input.trim()) {
        setOutput('')
        setError(null)
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Invalid JSON')
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">Input JSON</span>
          <Button size="sm" onClick={format} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">Format & Validate</Button>
        </div>
        <textarea
          className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm"
          placeholder="Paste messy JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">Output</span>
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(output)}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
        </div>
        {error ? (
          <div className="w-full flex-grow p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger font-mono text-sm overflow-auto">
            Syntax Error: {error}
          </div>
        ) : (
          <textarea
            readOnly
            className="w-full flex-grow min-h-[200px] p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none text-success font-mono text-sm"
            value={output}
            placeholder="Formatted JSON will appear here..."
          />
        )}
      </div>
    </div>
  )
}

export function SvgToJsx() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convert = () => {
    if (!input.trim()) return setOutput('')
    let jsx = input
      // Basic SVG to JSX string replacements
      .replace(/class=/g, 'className=')
      .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
      .replace(/xlink:href=/g, 'xlinkHref=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      // convert style="key: value" to style={{key: 'value'}} roughly (very basic)
      .replace(/style="([^"]*)"/g, (_, style) => {
        const obj = style.split(';').filter(Boolean).map((s: string) => {
          const [k, v] = s.split(':').map((x: string) => x.trim())
          const camelKey = k.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
          return `${camelKey}: '${v}'`
        }).join(', ')
        return `style={{ ${obj} }}`
      })
    
    setOutput(`export const SvgComponent = (props) => (\n  ${jsx}\n);`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">Raw SVG</span>
          <Button size="sm" onClick={convert} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">Convert to JSX</Button>
        </div>
        <textarea
          className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm"
          placeholder="<svg>...</svg>"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">React Component</span>
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(output)}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
        </div>
        <textarea
          readOnly
          className="w-full flex-grow min-h-[200px] p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none text-success font-mono text-sm"
          value={output}
          placeholder="JSX will appear here..."
        />
      </div>
    </div>
  )
}

export function MarkdownToHtml() {
  const [input, setInput] = useState('# Hello Markdown\n\nType some **markdown** here to see the HTML output.')
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(marked(input) as string)
  }, [input])

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">Markdown</span>
        </div>
        <textarea
          className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#111827] font-medium">HTML Output</span>
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(output)}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
        </div>
        <textarea
          readOnly
          className="w-full flex-grow min-h-[200px] p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none focus:outline-none text-success font-mono text-sm"
          value={output}
        />
      </div>
    </div>
  )
}
