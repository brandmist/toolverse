import { useState } from 'react'
import { Button } from './button'

export function UrlEncoder() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827] font-mono text-sm"
        placeholder="Type or paste URL string here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover border-0 text-[#111827]" onClick={() => { try { setText(encodeURIComponent(text)) } catch(e) {} }}>Encode URL</Button>
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => { try { setText(decodeURIComponent(text)) } catch(e) {} }}>Decode URL</Button>
      </div>
    </div>
  )
}
