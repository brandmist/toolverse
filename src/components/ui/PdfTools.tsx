/**
 * PdfTools.tsx — All PDF tools implemented using pdf-lib (browser-native, no API)
 * 
 * Tools:
 *   PdfCompressor   — re-saves PDF (minor size reduction via re-serialization)
 *   PdfMerger       — merge multiple PDFs into one
 *   PdfSplitter     — extract individual pages
 *   PdfToImage      — render pages to PNG via PDF.js
 *   ImageToPdf      — combine images into a PDF
 *   PdfRotate       — rotate pages in a PDF
 *   PdfWatermark    — text watermark on every page
 *   PdfToText       — extract embedded text from PDF
 */

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, FileText, Trash2, RotateCw, Plus, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { PDFDocument, degrees, rgb, StandardFonts, grayscale } from 'pdf-lib'

/* ─────────── Shared helpers ─────────── */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as ArrayBuffer)
    r.onerror = rej
    r.readAsArrayBuffer(file)
  })

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

function PdfDropZone({ onFiles, multiple = false, label = 'Click or drag PDF here', sub = 'PDF files supported' }: {
  onFiles: (files: File[]) => void; multiple?: boolean; label?: string; sub?: string
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const handle = (files: FileList | null) => {
    if (files && files.length > 0) onFiles(Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf')))
  }
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${dragging ? 'border-[#E5E7EB] bg-[#FAFAFA] border border-[#E5E7EB]' : 'border-[#E5E7EB] hover:border-white/30 bg-white/2'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
    >
      <FileText className="w-12 h-12 text-danger mb-4" />
      <p className="text-[#111827] font-medium mb-1">{label}</p>
      <p className="text-[#6B7280] text-sm">{sub}</p>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple={multiple} className="hidden" onChange={e => handle(e.target.files)} />
    </div>
  )
}

const fmtSize = (n: number) => n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`

/* ─────────── 1. PDF Merger ─────────── */
export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const addFiles = (newFiles: File[]) => setFiles(prev => [...prev, ...newFiles])
  const remove = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i))
  const moveUp = (i: number) => setFiles(f => { const a = [...f]; if (i > 0) [a[i-1], a[i]] = [a[i], a[i-1]]; return a })
  const moveDown = (i: number) => setFiles(f => { const a = [...f]; if (i < a.length-1) [a[i], a[i+1]] = [a[i+1], a[i]]; return a })

  const merge = async () => {
    if (files.length < 2) { setError('Add at least 2 PDF files to merge.'); return }
    setProcessing(true); setError('')
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const buf = await readFileAsArrayBuffer(file)
        const doc = await PDFDocument.load(buf)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const bytes = await merged.save()
      downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), 'merged.pdf')
    } catch (e: any) {
      setError('Failed to merge: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {files.length === 0 ? (
        <PdfDropZone multiple onFiles={addFiles} label="Drop PDF files here to merge" sub="Select multiple PDFs — order can be adjusted below" />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">{files.length} PDF{files.length > 1 ? 's' : ''} selected • Drag to reorder</span>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm" onClick={() => { const i = document.createElement('input'); i.type='file'; i.accept='.pdf,application/pdf'; i.multiple=true; i.onchange=e=>addFiles(Array.from((e.target as HTMLInputElement).files||[])); i.click() }}>
              <Plus className="w-4 h-4 mr-1" /> Add More
            </Button>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-3 group">
                <span className="text-[#6B7280] text-xs font-bold w-5 text-center">{i+1}</span>
                <FileText className="w-5 h-5 text-danger flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="text-sm text-[#111827] truncate">{f.name}</p>
                  <p className="text-xs text-[#6B7280]">{fmtSize(f.size)}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveUp(i)} className="p-1 rounded hover:bg-white/10 text-[#6B7280]">↑</button>
                  <button onClick={() => moveDown(i)} className="p-1 rounded hover:bg-white/10 text-[#6B7280]">↓</button>
                  <button onClick={() => remove(i)} className="p-1 rounded hover:bg-[#FAFAFA] border border-[#E5E7EB] text-danger"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <div className="flex gap-3">
            <Button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={merge} disabled={processing}>
              {processing ? 'Merging…' : <><Download className="w-4 h-4 mr-2" /> Merge & Download</>}
            </Button>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => { setFiles([]); setError('') }}>Clear All</Button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────── 2. PDF Splitter ─────────── */
export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'all' | 'select' | 'range'>('all')
  const [rangeStr, setRangeStr] = useState('1-3')

  const onFile = async (files: File[]) => {
    const f = files[0]; if (!f) return
    setError('')
    try {
      const buf = await readFileAsArrayBuffer(f)
      const doc = await PDFDocument.load(buf)
      setFile(f); setPageCount(doc.getPageCount()); setSelected(new Set())
    } catch (e: any) { setError('Could not read PDF: ' + e.message) }
  }

  const parseRange = (r: string): number[] => {
    const nums = new Set<number>()
    r.split(',').forEach(part => {
      const m = part.trim().match(/^(\d+)(?:-(\d+))?$/)
      if (m) {
        const from = parseInt(m[1]), to = m[2] ? parseInt(m[2]) : from
        for (let i = from; i <= Math.min(to, pageCount); i++) nums.add(i)
      }
    })
    return Array.from(nums).sort((a, b) => a - b)
  }

  const split = async () => {
    if (!file) return
    setProcessing(true); setError('')
    try {
      const buf = await readFileAsArrayBuffer(file)
      const srcDoc = await PDFDocument.load(buf)

      let pageIndices: number[] = []
      if (mode === 'all') pageIndices = srcDoc.getPageIndices()
      else if (mode === 'select') pageIndices = Array.from(selected).sort((a: number, b: number) => a - b).map((n: number) => n - 1)
      else if (mode === 'range') pageIndices = parseRange(rangeStr).map((n: number) => n - 1)

      if (pageIndices.length === 0) { setError('No pages selected.'); setProcessing(false); return }

      if (mode === 'all') {
        // Extract each page individually
        for (const idx of pageIndices) {
          const newDoc = await PDFDocument.create()
          const [page] = await newDoc.copyPages(srcDoc, [idx])
          newDoc.addPage(page)
          const bytes = await newDoc.save()
          downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), `page-${idx + 1}.pdf`)
          await new Promise(r => setTimeout(r, 100)) // stagger downloads
        }
      } else {
        // Extract selected pages as one PDF
        const newDoc = await PDFDocument.create()
        const pages = await newDoc.copyPages(srcDoc, pageIndices)
        pages.forEach(p => newDoc.addPage(p))
        const bytes = await newDoc.save()
        downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), `extracted-pages.pdf`)
      }
    } catch (e: any) { setError('Failed: ' + e.message) } finally { setProcessing(false) }
  }

  const togglePage = (n: number) => setSelected(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!file ? (
        <PdfDropZone onFiles={onFile} label="Drop a PDF to split" sub="Extract individual pages or custom ranges" />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-grow min-w-0">
              <FileText className="w-8 h-8 text-danger flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#111827] font-medium truncate">{file.name}</p>
                <p className="text-[#6B7280] text-xs">{pageCount} pages · {fmtSize(file.size)}</p>
              </div>
            </div>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm flex-shrink-0" onClick={() => { setFile(null); setPageCount(0) }}>Change</Button>
          </div>

          <div className="flex gap-2">
            {[{id:'all', label:'All Pages'},{id:'select',label:'Pick Pages'},{id:'range',label:'Page Range'}].map(m => (
              <button key={m.id} onClick={() => setMode(m.id as any)} className={`px-4 py-2 rounded-lg text-sm border font-medium transition-colors ${mode === m.id ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{m.label}</button>
            ))}
          </div>

          {mode === 'select' && (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
              {Array.from({length: pageCount}, (_, i) => i+1).map(n => (
                <button key={n} onClick={() => togglePage(n)} className={`w-10 h-10 rounded-lg text-sm font-bold border transition-colors ${selected.has(n) ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{n}</button>
              ))}
            </div>
          )}

          {mode === 'range' && (
            <div>
              <label className="text-sm text-[#111827] block mb-1">Page Range <span className="text-[#6B7280]">(e.g. 1-3, 5, 7-9)</span></label>
              <input type="text" value={rangeStr} onChange={e => setRangeStr(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
          )}

          {mode === 'all' && <p className="text-[#6B7280] text-sm">Each page will be downloaded as a separate PDF file.</p>}

          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={split} disabled={processing}>
            {processing ? 'Extracting…' : <><Download className="w-4 h-4 mr-2" /> {mode === 'all' ? `Download ${pageCount} Pages` : 'Extract & Download'}</>}
          </Button>
        </>
      )}
    </div>
  )
}

/* ─────────── 3. Images To PDF ─────────── */
export function ImagesToPdf() {
  const [images, setImages] = useState<{ url: string; name: string; size: number }[]>([])
  const [processing, setProcessing] = useState(false)
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'fit'>('A4')
  const [quality, setQuality] = useState(0.9)

  const addImages = (files: File[]) => {
    files.filter(f => f.type.startsWith('image/')).forEach(f => {
      const r = new FileReader()
      r.onload = e => setImages(prev => [...prev, { url: e.target?.result as string, name: f.name, size: f.size }])
      r.readAsDataURL(f)
    })
  }

  const convert = async () => {
    if (images.length === 0) return
    setProcessing(true)
    try {
      const doc = await PDFDocument.create()
      for (const img of images) {
        const res = await fetch(img.url)
        const buf = await res.arrayBuffer()

        let embedded
        if (img.name.toLowerCase().endsWith('.png') || img.url.startsWith('data:image/png')) {
          embedded = await doc.embedPng(buf)
        } else {
          embedded = await doc.embedJpg(buf)
        }

        const pW = pageSize === 'A4' ? 595.28 : pageSize === 'Letter' ? 612 : embedded.width
        const pH = pageSize === 'A4' ? 841.89 : pageSize === 'Letter' ? 792 : embedded.height
        const page = doc.addPage([pW, pH])
        const scale = Math.min(pW / embedded.width, pH / embedded.height)
        const w = embedded.width * scale
        const h = embedded.height * scale
        page.drawImage(embedded, { x: (pW - w) / 2, y: (pH - h) / 2, width: w, height: h })
      }
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), 'images.pdf')
    } catch (e: any) { alert('Error: ' + e.message) } finally { setProcessing(false) }
  }

  const remove = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {images.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-12 cursor-pointer transition-all"
          onClick={() => { const i = document.createElement('input'); i.type='file'; i.accept='image/*'; i.multiple=true; i.onchange=e=>addImages(Array.from((e.target as HTMLInputElement).files||[])); i.click() }}
        >
          <Upload className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Drop images here</p>
          <p className="text-[#6B7280] text-sm">PNG, JPG, WEBP — each image becomes one PDF page</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">{images.length} image{images.length > 1 ? 's' : ''} selected</span>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm" onClick={() => { const i = document.createElement('input'); i.type='file'; i.accept='image/*'; i.multiple=true; i.onchange=e=>addImages(Array.from((e.target as HTMLInputElement).files||[])); i.click() }}>
              <Plus className="w-4 h-4 mr-1" /> Add More
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-auto">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-[#E5E7EB] bg-white border border-[#E5E7EB]">
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => remove(i)} className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] hover:bg-white border border-[#E5E7EB] text-[#111827]"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-[#6B7280] truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#111827] block mb-2">Page Size</label>
              <div className="flex gap-2">
                {(['A4', 'Letter', 'fit'] as const).map(s => (
                  <button key={s} onClick={() => setPageSize(s)} className={`flex-1 py-2 rounded-lg text-sm border font-medium transition-colors ${pageSize === s ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{s === 'fit' ? 'Fit' : s}</button>
                ))}
              </div>
            </div>
          </div>
          <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={convert} disabled={processing}>
            {processing ? 'Converting…' : <><Download className="w-4 h-4 mr-2" /> Create PDF</>}
          </Button>
          <button className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors text-left" onClick={() => setImages([])}>Clear all images</button>
        </>
      )}
    </div>
  )
}

/* ─────────── 4. PDF To Image ─────────── */
export function PdfToImage({ defaultFormat }: { defaultFormat?: 'png' | 'jpeg' | 'webp' }) {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [scale, setScale] = useState(2)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>(defaultFormat || 'png')
  const [zipping, setZipping] = useState(false)

  const convert = async (f: File) => {
    setFile(f); setImages([]); setProcessing(true); setError(''); setProgress(0)
    try {
      // Dynamically load pdfjs-dist to avoid bundle bloat
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await readFileAsArrayBuffer(f)
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buf) })
      const pdf = await loadingTask.promise
      const total = pdf.numPages
      const results: string[] = []

      const mimeType = `image/${format}`

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport } as any).promise
        results.push(canvas.toDataURL(mimeType, 0.9))
        setProgress(Math.round((i / total) * 100))
      }
      setImages(results)
    } catch (e: any) { setError('Failed to convert: ' + e.message) } finally { setProcessing(false) }
  }

  const downloadAllAsZip = async () => {
    if (images.length === 0 || !file) return
    setZipping(true)
    try {
      // Dynamically import JSZip from CDN
      // @ts-ignore
      const JSZipModule = await import('https://esm.sh/jszip@3.10.1')
      const JSZip = JSZipModule.default
      const zip = new JSZip()
      
      const ext = format === 'jpeg' ? 'jpg' : format

      for (let i = 0; i < images.length; i++) {
        const res = await fetch(images[i])
        const blob = await res.blob()
        zip.file(`page-${i + 1}.${ext}`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      downloadBlob(zipBlob, `${file.name.replace('.pdf', '')}-images.zip`)
    } catch (e: any) {
      setError('Failed to create ZIP: ' + e.message)
    } finally {
      setZipping(false)
    }
  }

  const ext = format === 'jpeg' ? 'jpg' : format

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!file || images.length === 0 ? (
        <>
          <PdfDropZone onFiles={f => convert(f[0])} label="Drop a PDF to convert to images" sub="Each page will become a separate image file" />
          {processing && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-[#6B7280]">
                <span>Converting pages… {progress}%</span>
              </div>
              <div className="w-full h-2 bg-white border border-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-white border border-[#E5E7EB] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-[#111827]">Render Quality</label><span className="text-sm text-[#6B7280]">{scale}x scale</span></div>
              <input type="range" min="1" max="4" step="0.5" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-rose-500" />
              <div className="flex justify-between text-xs text-[#6B7280] mt-1"><span>Faster</span><span>Higher Quality</span></div>
            </div>
            <div>
              <label className="text-sm text-[#111827] block mb-2">Image Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['png', 'jpeg', 'webp'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase border transition-colors ${format === fmt ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-sm text-[#6B7280]">
              {images.length} pages converted to <span className="text-[#111827] font-bold uppercase">{ext}</span> from <span className="text-[#111827] font-medium truncate">{file.name}</span>
            </span>
            <div className="flex gap-2">
              <Button onClick={downloadAllAsZip} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm" disabled={zipping}>
                {zipping ? 'Creating ZIP…' : <><Download className="w-4 h-4 mr-2" /> Download ZIP</>}
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm" onClick={() => { setFile(null); setImages([]) }}>New File</Button>
            </div>
          </div>
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-auto">
            {images.map((img, i) => (
              <div key={i} className="flex flex-col gap-2 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl overflow-hidden">
                <img src={img} alt={`Page ${i+1}`} className="w-full object-contain bg-white" />
                <div className="flex items-center justify-between p-3 pt-0">
                  <span className="text-xs text-[#6B7280]">Page {i+1}</span>
                  <a href={img} download={`page-${i+1}.${ext}`}>
                    <Button className="text-xs py-1.5 px-3 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">
                      <Download className="w-3 h-3 mr-1" /> {ext.toUpperCase()}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────── 5. PDF Watermark ─────────── */
export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.2)
  const [angle, setAngle] = useState(45)
  const [fontSize, setFontSize] = useState(60)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const apply = async () => {
    if (!file) return
    setProcessing(true); setError('')
    try {
      const buf = await readFileAsArrayBuffer(file)
      const doc = await PDFDocument.load(buf)
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      const pages = doc.getPages()

      for (const page of pages) {
        const { width, height } = page.getSize()
        page.drawText(text, {
          x: width / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(angle),
          xSkew: degrees(0),
          ySkew: degrees(0),
        })
      }

      const bytes = await doc.save()
      downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), 'watermarked.pdf')
    } catch (e: any) { setError('Failed: ' + e.message) } finally { setProcessing(false) }
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!file ? (
        <PdfDropZone onFiles={f => setFile(f[0])} label="Drop a PDF to add watermark" />
      ) : (
        <>
          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4">
            <FileText className="w-8 h-8 text-danger flex-shrink-0" />
            <div className="flex-grow min-w-0"><p className="text-[#111827] truncate font-medium">{file.name}</p><p className="text-[#6B7280] text-xs">{fmtSize(file.size)}</p></div>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm flex-shrink-0" onClick={() => setFile(null)}>Change</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-[#111827] block mb-1">Watermark Text</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-[#111827]">Font Size</label><span className="text-sm text-[#6B7280]">{fontSize}pt</span></div>
              <input type="range" min="20" max="150" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-[#111827]">Opacity</label><span className="text-sm text-[#6B7280]">{Math.round(opacity * 100)}%</span></div>
              <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-[#111827]">Angle</label><span className="text-sm text-[#6B7280]">{angle}°</span></div>
              <input type="range" min="0" max="90" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-rose-500" />
            </div>
          </div>
          {/* Preview */}
          <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-8 flex items-center justify-center min-h-32 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bold text-[#6B7280] select-none whitespace-nowrap"
                style={{ fontSize: `${Math.min(fontSize * 0.6, 60)}px`, opacity, transform: `rotate(-${angle}deg)` }}>
                {text}
              </span>
            </div>
            <div className="relative z-10 text-center">
              <FileText className="w-12 h-12 text-[#111827] mx-auto mb-2" />
              <p className="text-[#6B7280] text-sm">PDF Preview</p>
            </div>
          </div>
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={apply} disabled={processing}>
            {processing ? 'Applying…' : <><Download className="w-4 h-4 mr-2" /> Apply Watermark & Download</>}
          </Button>
        </>
      )}
    </div>
  )
}

/* ─────────── 6. PDF Page Rotator ─────────── */
export function PdfRotate() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [rotations, setRotations] = useState<Record<number, number>>({})
  const [globalRot, setGlobalRot] = useState(90)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const onFile = async (files: File[]) => {
    const f = files[0]; if (!f) return
    try {
      const buf = await readFileAsArrayBuffer(f)
      const doc = await PDFDocument.load(buf)
      setFile(f); setPageCount(doc.getPageCount()); setRotations({})
    } catch (e: any) { setError('Could not read: ' + e.message) }
  }

  const setPageRot = (page: number, deg: number) => setRotations(r => ({ ...r, [page]: deg }))
  const applyAll = () => {
    const r: Record<number, number> = {}
    for (let i = 1; i <= pageCount; i++) r[i] = globalRot
    setRotations(r)
  }

  const rotate = async () => {
    if (!file) return
    setProcessing(true); setError('')
    try {
      const buf = await readFileAsArrayBuffer(file)
      const doc = await PDFDocument.load(buf)
      const pages = doc.getPages()
      pages.forEach((page, i) => {
        const deg = rotations[i + 1] ?? 0
        if (deg !== 0) page.setRotation(degrees(deg))
      })
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), 'rotated.pdf')
    } catch (e: any) { setError('Failed: ' + e.message) } finally { setProcessing(false) }
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!file ? (
        <PdfDropZone onFiles={onFile} label="Drop a PDF to rotate pages" />
      ) : (
        <>
          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4">
            <FileText className="w-7 h-7 text-danger" />
            <div className="flex-grow min-w-0"><p className="text-[#111827] truncate">{file.name}</p><p className="text-[#6B7280] text-xs">{pageCount} pages</p></div>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm" onClick={() => setFile(null)}>Change</Button>
          </div>
          <div className="flex items-center gap-3 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4">
            <span className="text-sm text-[#111827]">Apply to all pages:</span>
            <div className="flex gap-2">
              {[90, 180, 270].map(d => (
                <button key={d} onClick={() => setGlobalRot(d)} className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${globalRot === d ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{d}°</button>
              ))}
            </div>
            <Button className="bg-[#FAFAFA] border border-[#E5E7EB] hover:bg-[#FAFAFA] border border-[#E5E7EB] text-danger border border-[#E5E7EB] text-sm" onClick={applyAll}>Apply to All</Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-56 overflow-auto">
            {Array.from({length: pageCount}, (_, i) => i+1).map(n => (
              <div key={n} className="flex flex-col items-center gap-1 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-3">
                <span className="text-xs text-[#6B7280] font-bold">P{n}</span>
                <RotateCw className="w-5 h-5 text-[#6B7280]" style={{ transform: `rotate(${rotations[n] ?? 0}deg)` }} />
                <div className="flex gap-1 w-full">
                  {[90, 180, 270].map(d => (
                    <button key={d} onClick={() => setPageRot(n, d)} className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors ${rotations[n] === d ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{d}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={rotate} disabled={processing}>
            {processing ? 'Rotating…' : <><Download className="w-4 h-4 mr-2" /> Save Rotated PDF</>}
          </Button>
        </>
      )}
    </div>
  )
}

/* ─────────── 7. PDF To Text ─────────── */
export function PdfToText() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const extract = async (f: File) => {
    setFile(f); setText(''); setProcessing(true); setError(''); setProgress(0)
    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await readFileAsArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      const chunks: string[] = []

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ')
        chunks.push(`--- Page ${i} ---\n${pageText}`)
        setProgress(Math.round((i / total) * 100))
      }
      setText(chunks.join('\n\n'))
    } catch (e: any) { setError('Failed to extract text: ' + e.message) } finally { setProcessing(false) }
  }

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    downloadBlob(blob, `${file?.name.replace('.pdf', '') ?? 'extracted'}.txt`)
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!file ? (
        <PdfDropZone onFiles={f => extract(f[0])} label="Drop a PDF to extract text" sub="Works with text-based PDFs (not scanned images)" />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-danger flex-shrink-0" />
            <div className="flex-grow min-w-0"><p className="text-[#111827] truncate">{file.name}</p></div>
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm flex-shrink-0" onClick={() => { setFile(null); setText('') }}>New File</Button>
          </div>
          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#6B7280]"><span>Extracting text…</span><span>{progress}%</span></div>
              <div className="w-full h-2 bg-white border border-[#E5E7EB] rounded-full overflow-hidden"><div className="h-full bg-white border border-[#E5E7EB] rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          {text && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B7280]">{text.length.toLocaleString()} characters extracted</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827] text-sm" onClick={() => navigator.clipboard.writeText(text)}>Copy Text</Button>
                  <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm" onClick={downloadTxt}><Download className="w-4 h-4 mr-1" /> .txt</Button>
                </div>
              </div>
              <textarea
                readOnly
                className="flex-grow w-full min-h-[350px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-[#111827] font-mono text-sm leading-relaxed"
                value={text}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

/* ─────────── 8. PDF Compressor (re-serialize = slight reduction) ─────────── */
export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const compress = async (f: File) => {
    setFile(f); setResult(null); setProcessing(true); setError('')
    try {
      const buf = await readFileAsArrayBuffer(f)
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
      // pdf-lib re-serializes the PDF — removes redundant xref data, re-compresses streams
      const bytes = await doc.save({ useObjectStreams: true })
      const blob = new Blob([bytes as any], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e: any) { setError('Failed: ' + e.message) } finally { setProcessing(false) }
  }

  const savings = result ? Math.max(0, Math.round((1 - result.size / (file?.size ?? 1)) * 100)) : 0

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-warning text-sm flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>This tool re-serializes the PDF structure to reduce file size. Results vary by PDF — heavily image-laden PDFs require specialized server-side tools for deep compression.</span>
      </div>
      {!file ? (
        <PdfDropZone onFiles={f => compress(f[0])} label="Drop a PDF to compress" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-5 text-center">
              <div className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Original</div>
              <div className="text-2xl font-bold text-[#111827]">{fmtSize(file.size)}</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-5 text-center">
              <div className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Compressed</div>
              <div className={`text-2xl font-bold ${result ? (savings > 0 ? 'text-success' : 'text-warning') : 'text-[#6B7280]'}`}>
                {result ? fmtSize(result.size) : processing ? '…' : '—'}
              </div>
            </div>
          </div>
          {result && savings > 0 && (
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-center">
              <span className="text-success font-bold text-lg">✓ Saved {savings}%</span>
              <span className="text-[#6B7280] text-sm ml-2">({fmtSize(file.size - result.size)} reduced)</span>
            </div>
          )}
          {result && savings === 0 && (
            <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-center text-[#6B7280] text-sm">
              This PDF is already well-optimized. No significant reduction possible.
            </div>
          )}
          {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <div className="flex gap-3">
            {result && (
              <a href={result.url} download="compressed.pdf" className="flex-1">
                <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium">
                  <Download className="w-4 h-4 mr-2" /> Download Compressed PDF
                </Button>
              </a>
            )}
            <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => { setFile(null); setResult(null) }}>Clear</Button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────── 9. Text To PDF ─────────── */
export function TextToPdf() {
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [fontSize, setFontSize] = useState(12)
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4')

  const convert = async () => {
    if (!text.trim()) return
    setProcessing(true); setError('')
    try {
      const doc = await PDFDocument.create()
      const font = await doc.embedFont(StandardFonts.Helvetica)
      const pW = pageSize === 'A4' ? 595.28 : 612
      const pH = pageSize === 'A4' ? 841.89 : 792
      const margin = 50
      const maxWidth = pW - margin * 2
      const lineHeight = fontSize * 1.5

      let page = doc.addPage([pW, pH])
      let y = pH - margin

      // pdf-lib's StandardFonts only support WinAnsi encoding.
      // Strip emojis and non-WinAnsi unicode characters to prevent crashing.
      const winAnsiRegex = /[^\x00-\x7F\xA0-\xFF\u0152\u0153\u0178\u0192\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u02C6\u02DC]/g;
      const safeText = text.replace(winAnsiRegex, '');

      const rawLines = safeText.split('\n')
      for (const rawLine of rawLines) {
        // Simple word wrap
        const words = rawLine.split(' ')
        let currentLine = ''
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const width = font.widthOfTextAtSize(testLine, fontSize)
          
          if (width > maxWidth && currentLine) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) })
            y -= lineHeight
            currentLine = word
            
            if (y < margin) {
              page = doc.addPage([pW, pH])
              y = pH - margin
            }
          } else {
            currentLine = testLine
          }
        }
        
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) })
          y -= lineHeight
          if (y < margin) {
            page = doc.addPage([pW, pH])
            y = pH - margin
          }
        }
      }

      const bytes = await doc.save()
      downloadBlob(new Blob([bytes as any], { type: 'application/pdf' }), 'document.pdf')
    } catch (e: any) { setError('Failed to create PDF: ' + e.message) } finally { setProcessing(false) }
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex flex-col flex-grow gap-4">
        <textarea
          className="flex-grow min-h-[300px] w-full bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-[#111827] font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
          placeholder="Type or paste your text here to convert into a PDF document..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        
        <p className="text-xs text-[#6B7280] flex items-center gap-1.5 px-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Note: Emojis and complex non-Latin characters are automatically omitted to ensure PDF compatibility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB]">
          <div>
            <label className="text-sm text-[#111827] block mb-2">Page Size</label>
            <div className="flex gap-2">
              {(['A4', 'Letter'] as const).map(s => (
                <button key={s} onClick={() => setPageSize(s)} className={`flex-1 py-2 rounded-lg text-sm border font-medium transition-colors ${pageSize === s ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1"><label className="text-sm text-[#111827]">Font Size</label><span className="text-sm text-[#6B7280]">{fontSize}pt</span></div>
            <input type="range" min="8" max="72" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-rose-500" />
          </div>
        </div>

        {error && <p className="text-danger text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        
        <div className="flex gap-3 mt-2">
          <Button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-medium" onClick={convert} disabled={processing || !text.trim()}>
            {processing ? 'Generating PDF…' : <><Download className="w-4 h-4 mr-2" /> Convert to PDF</>}
          </Button>
          <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => setText('')}>Clear Text</Button>
        </div>
      </div>
    </div>
  )
}
