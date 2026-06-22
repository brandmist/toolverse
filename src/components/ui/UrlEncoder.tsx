import { useState } from 'react'
import { Button } from './button'

export function UrlEncoder() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-card border border-border border-white/10 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-text-primary font-mono text-sm"
        placeholder="Type or paste URL string here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-card border border-border hover:bg-card-hover border-0 text-text-primary" onClick={() => { try { setText(encodeURIComponent(text)) } catch(e) {} }}>Encode URL</Button>
        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => { try { setText(decodeURIComponent(text)) } catch(e) {} }}>Decode URL</Button>
      </div>
    </div>
  )
}
