import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// ── Shared Hooks ──────────────────────────────────────────────────────────────

export function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return { copied, copy }
}

// ── Shared Components ─────────────────────────────────────────────────────────

export function CopyButton({ text, className = '' }: { text: string, className?: string }) {
  const { copied, copy } = useCopy()
  if (!text) return null
  return (
    <button
      onClick={() => copy(text)}
      className={`tool-copy-btn ${copied ? 'copied' : ''} ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export function TabBar<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="tool-tab-bar" role="tablist">
      {options.map(opt => (
        <button
          key={opt}
          role="tab"
          aria-selected={value === opt}
          onClick={() => onChange(opt)}
          className={`tool-tab capitalize ${value === opt ? 'active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function StatChip({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="tool-stat-chip">
      <strong>{value}</strong> {label}
    </span>
  )
}
