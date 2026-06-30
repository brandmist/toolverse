import { useState, useMemo } from 'react'
import { CopyButton, TabBar, StatChip } from './ToolLayout'

export function CaseConverter() {
  const [text, setText] = useState('')

  const conversions = {
    'UPPERCASE': text.toUpperCase(),
    'lowercase': text.toLowerCase(),
    'Title Case': text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
    'camelCase': text.split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
    'kebab-case': text.toLowerCase().replace(/\s+/g, '-'),
    'snake_case': text.toLowerCase().replace(/\s+/g, '_')
  }

  return (
    <div className="tool-panel">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="tool-label" htmlFor="case-input">Input Text</label>
        </div>
        <textarea
          id="case-input"
          className="min-h-[160px]"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {text && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(conversions).map(([label, convertedText]) => (
            <div key={label} className="flex flex-col gap-1.5 p-3 bg-surface border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-muted">{label}</span>
                <CopyButton text={convertedText} />
              </div>
              <p className="text-[14px] text-primary break-all font-mono">
                {convertedText || '\u00A0'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
