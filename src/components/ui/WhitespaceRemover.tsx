import { useState } from 'react'
import { Button } from './button'

export function WhitespaceRemover() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <textarea
        className="w-full flex-grow min-h-[200px] p-4 bg-card border border-border border-white/10 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-text-primary"
        placeholder="Type or paste your text here to remove whitespace..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setText(text.replace(/ +/g, ''))}>Remove Spaces</Button>
        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setText(text.replace(/\t+/g, ''))}>Remove Tabs</Button>
        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setText(text.replace(/\n+/g, ''))}>Remove Newlines</Button>
        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setText(text.replace(/\s+/g, ''))}>Remove All</Button>
      </div>
    </div>
  )
}
