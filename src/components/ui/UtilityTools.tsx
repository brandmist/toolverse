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
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-[300px]">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-[#111827] mb-2">Input List (one item per line)</label>
          <textarea
            className="w-full flex-grow p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-[#111827]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-[#111827] mb-2">Randomized List</label>
          <textarea
            readOnly
            className="w-full flex-grow p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-success"
            value={output}
            placeholder="Shuffled items will appear here..."
          />
        </div>
      </div>
      <Button className="mt-6 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" size="lg" onClick={handleShuffle}>
        Shuffle List
      </Button>
    </div>
  )
}
