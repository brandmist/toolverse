import { useState } from 'react'
import { Button } from './button'

export function WhitespaceRemover() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827]"
        placeholder="Type or paste your text here to remove whitespace..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => setText(text.replace(/ +/g, ''))}>Remove Spaces</Button>
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => setText(text.replace(/\t+/g, ''))}>Remove Tabs</Button>
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => setText(text.replace(/\n+/g, ''))}>Remove Newlines</Button>
        <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => setText(text.replace(/\s+/g, ''))}>Remove All</Button>
      </div>
    </div>
  )
}
