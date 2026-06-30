import { useState } from 'react'
import { StatChip } from './ToolLayout'

export function LetterCounter() {
  const [text, setText] = useState('')

  const chars = text.length
  const charsNoSpaces = text.replace(/\s+/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0

  return (
    <div className="tool-panel">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{chars}</div>
          <div className="text-[11px] text-muted uppercase tracking-wider mt-1 font-semibold">Chars</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{charsNoSpaces}</div>
          <div className="text-[11px] text-muted uppercase tracking-wider mt-1 font-semibold">No Spaces</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-success">{words}</div>
          <div className="text-[11px] text-muted uppercase tracking-wider mt-1 font-semibold">Words</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{sentences}</div>
          <div className="text-[11px] text-muted uppercase tracking-wider mt-1 font-semibold">Sentences</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{paragraphs}</div>
          <div className="text-[11px] text-muted uppercase tracking-wider mt-1 font-semibold">Paragraphs</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="tool-label" htmlFor="counter-input">Input Text</label>
        <textarea
          id="counter-input"
          className="min-h-[240px]"
          placeholder="Type or paste your text here to count..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  )
}
