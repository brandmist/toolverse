import { useState } from 'react'
import { Button } from './button'

export function ListRandomizer() {
  const [text, setText] = useState('Apple\nBanana\nCherry\nDate')
  const [output, setOutput] = useState('')

  const handleShuffle = () => {
    if (!text.trim()) return
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    // Fisher-Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[lines[i], lines[j]] = [lines[j], lines[i]]
    }
    setOutput(lines.join('\n'))
  }

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-[300px]">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-primary mb-2">Input List (one item per line)</label>
          <textarea
            className="w-full flex-grow p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-text-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-primary mb-2">Randomized List</label>
          <textarea
            readOnly
            className="w-full flex-grow p-4 bg-card border border-border border-white/10 rounded-xl resize-none text-success"
            value={output}
            placeholder="Shuffled items will appear here..."
          />
        </div>
      </div>
      <Button className="mt-6 bg-card border border-border hover:bg-card-hover text-text-primary" size="lg" onClick={handleShuffle}>
        Shuffle List
      </Button>
    </div>
  )
}
