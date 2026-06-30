import { useState } from 'react'
import { Button } from './button'

export function UrlEncoder() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-white border border-border border-border rounded-xl mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-text-primary text-primary font-mono text-sm"
        placeholder="Type or paste URL string here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-white border border-border hover:bg-white-hover border-0 text-primary" onClick={() => { try { setText(encodeURIComponent(text)) } catch(e) {} }}>Encode URL</Button>
        <Button variant="outline" className="border-border hover:bg-white/10 text-primary" onClick={() => { try { setText(decodeURIComponent(text)) } catch(e) {} }}>Decode URL</Button>
      </div>
    </div>
  )
}
