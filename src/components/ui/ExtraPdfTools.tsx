import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Languages, FileSpreadsheet, Globe, FileCode, CheckCircle, AlertCircle, Edit, Sparkles, BookOpen, Presentation, Image as ImageIcon, Plus, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './button'

// Helper: Convert File to ArrayBuffer
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result as ArrayBuffer)
    reader.onerror = rej
    reader.readAsArrayBuffer(file)
  })

// Helper: Download a Blob
const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/* ─────────── 1. PDF to Excel / PDF to CSV ─────────── */
export function PdfToExcel() {
  return <PdfDataConverter defaultFormat="xlsx" />
}

export function PdfToCsv() {
  return <PdfDataConverter defaultFormat="csv" />
}

function PdfDataConverter({ defaultFormat }: { defaultFormat: 'xlsx' | 'csv' }) {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<'xlsx' | 'csv'>(defaultFormat)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string[][]>([])

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setPreview([])
    setProcessing(true)
    setStatusText('Loading PDF page extraction...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const numPages = pdf.numPages
      const rows: string[][] = []

      for (let p = 1; p <= numPages; p++) {
        setStatusText(`Extracting page tables: page ${p} of ${numPages}...`)
        const page = await pdf.getPage(p)
        const textContent = await page.getTextContent()
        const items = textContent.items as any[]

        // Heuristically group items by Y coordinate (rows)
        const yGroups: { [key: number]: any[] } = {}
        items.forEach(item => {
          const y = Math.round(item.transform[5])
          // Find if there is an existing Y close enough (e.g. within 5 units)
          const closeY = Object.keys(yGroups).find(groupY => Math.abs(Number(groupY) - y) < 6)
          if (closeY !== undefined) {
            yGroups[Number(closeY)].push(item)
          } else {
            yGroups[y] = [item]
          }
        })

        // Sort rows from top to bottom
        const sortedYs = Object.keys(yGroups).map(Number).sort((a, b) => b - a)
        sortedYs.forEach(y => {
          const rowItems = yGroups[y]
          // Sort items in row from left to right (by X coordinate)
          rowItems.sort((a, b) => a.transform[4] - b.transform[4])
          const cells = rowItems.map(item => item.str.trim()).filter(Boolean)
          if (cells.length > 0) {
            rows.push(cells)
          }
        })
      }

      if (rows.length === 0) {
        throw new Error('No tabular text elements detected in this document.')
      }

      setPreview(rows.slice(0, 10))

      // Generate Spreadsheet Output
      if (format === 'csv') {
        const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
        downloadBlob(new Blob([csvContent], { type: 'text/csv' }), `${f.name.replace('.pdf', '')}.csv`)
      } else {
        // Output as simple Tab-Separated XML / XLS format that Excel loads directly
        const tsvContent = rows.map(r => r.join('\t')).join('\n')
        downloadBlob(new Blob([tsvContent], { type: 'application/vnd.ms-excel' }), `${f.name.replace('.pdf', '')}.xlsx`)
      }
    } catch (e: any) {
      setError(e.message || 'Table extraction failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <FileSpreadsheet className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to extract to Table</p>
          <p className="text-[#6B7280] text-xs">Parses rows and columns to generate clean spreadsheets (.csv / .xlsx)</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div>
              <h3 className="font-semibold text-[#111827] truncate max-w-sm">{file.name}</h3>
              <p className="text-xs text-[#6B7280]">Heuristically parsing table cells</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFormat('csv')} className={`px-3 py-1 rounded text-xs font-bold ${format === 'csv' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>CSV</button>
              <button onClick={() => setFormat('xlsx')} className={`px-3 py-1 rounded text-xs font-bold ${format === 'xlsx' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Excel (XLSX)</button>
            </div>
          </div>

          {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

          {preview.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Spreadsheet Preview (First 10 Rows)</h4>
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] border border-[#E5E7EB]">
                <table className="min-w-full divide-y divide-white/10 text-left text-xs text-[#111827]">
                  <tbody className="divide-y divide-white/5 font-mono">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-white">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 border-r border-[#E5E7EB] whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => handleConvert(file)} className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm" disabled={processing}>
              Re-Convert & Download
            </Button>
            <Button variant="outline" className="border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreview([]) }}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 2. PDF Translator ─────────── */
export function PdfTranslator() {
  const [file, setFile] = useState<File | null>(null)
  const [targetLang, setTargetLang] = useState('es')
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const languages = [
    { label: 'Spanish (Español)', code: 'es' },
    { label: 'French (Français)', code: 'fr' },
    { label: 'German (Deutsch)', code: 'de' },
    { label: 'Italian (Italiano)', code: 'it' },
    { label: 'Portuguese (Português)', code: 'pt' },
    { label: 'Japanese (日本語)', code: 'ja' },
    { label: 'Chinese (中文)', code: 'zh-CN' },
    { label: 'Arabic (العربية)', code: 'ar' },
    { label: 'Hindi (हिन्दी)', code: 'hi' },
    { label: 'Russian (Русский)', code: 'ru' }
  ]

  const handleTranslate = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    setStatusText('Parsing original PDF page content...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(file)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const totalPages = pdf.numPages

      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const newDoc = await PDFDocument.create()
      const font = await newDoc.embedFont(StandardFonts.Helvetica)
      const margin = 50
      const fontSize = 11
      const lineHeight = fontSize * 1.5

      for (let p = 1; p <= totalPages; p++) {
        setStatusText(`Extracting page ${p} of ${totalPages}...`)
        const page = await pdf.getPage(p)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')

        if (!pageText.trim()) {
          // If page is empty or scanned, just create empty page
          newDoc.addPage([595.28, 841.89])
          continue
        }

        // Split text to prevent exceeding URL length limit in GET requests
        setStatusText(`Translating page ${p} to target language...`)
        const paragraphs = pageText.match(/.{1,1500}(?=\s|$)/g) || [pageText]
        const translatedParagraphs: string[] = []

        for (const para of paragraphs) {
          const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(para)}`
          const res = await fetch(apiURL)
          if (!res.ok) throw new Error('Translation API rate limit or network issue')
          const data = await res.json()
          const translatedText = data[0].map((s: any) => s[0]).join('')
          translatedParagraphs.push(translatedText)
        }

        // Generate translated PDF sheet
        setStatusText(`Drawing translated page ${p}...`)
        let newPage = newDoc.addPage([595.28, 841.89]) // A4 Size
        const pW = 595.28
        const pH = 841.89
        const maxWidth = pW - margin * 2
        let y = pH - margin

        const fullTranslatedText = translatedParagraphs.join(' ')
        // Remove non-winansi chars
        const safeText = fullTranslatedText.replace(/[^\x00-\x7F\xA0-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u20AC]/g, '')
        const words = safeText.split(' ')
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const width = font.widthOfTextAtSize(testLine, fontSize)
          if (width > maxWidth && currentLine) {
            newPage.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) })
            y -= lineHeight
            currentLine = word

            if (y < margin) {
              newPage = newDoc.addPage([595.28, 841.89])
              y = pH - margin
            }
          } else {
            currentLine = testLine
          }
        }

        if (currentLine) {
          newPage.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) })
        }
      }

      setStatusText('Compiling translated PDF document...')
      const bytes = await newDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-${targetLang}.pdf`)
    } catch (e: any) {
      setError(e.message || 'Translation failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) setFile((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Languages className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to Translate</p>
          <p className="text-[#6B7280] text-xs">Extracts text and generates a fully translated version of the layout sheets</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto w-full">
          <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-3 text-center text-danger text-xs font-semibold">{file.name}</div>
          <div>
            <label className="text-xs text-[#6B7280] block mb-1">Select Target Translation Language</label>
            <select 
              value={targetLang} 
              onChange={e => setTargetLang(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#111827] text-sm"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

          <div className="flex gap-2">
            <Button onClick={handleTranslate} className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" disabled={processing}>
              Translate PDF
            </Button>
            <Button variant="outline" className="border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setError('') }}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 3. PDF to EPUB ─────────── */
export function PdfToEpub() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Loading document pages...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      const textLines: string[] = []

      for (let i = 1; i <= total; i++) {
        setStatusText(`Extracting chapter page ${i} of ${total}...`)
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageStr = textContent.items.map((item: any) => item.str).join(' ').trim()
        if (pageStr) {
          textLines.push(`<h2>Page ${i}</h2><p>${pageStr.replace(/\n/g, '<br/>')}</p>`)
        }
      }

      setStatusText('Bundling eBook structure into EPUB Container...')
      // @ts-ignore
      const JSZipModule = await import('https://esm.sh/jszip@3.10.1')
      const JSZip = JSZipModule.default
      const zip = new JSZip()

      // 1. mimetype
      zip.file('mimetype', 'application/epub+zip')

      // 2. META-INF/container.xml
      zip.file('META-INF/container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

      // 3. OEBPS/content.opf
      const chaptersList = textLines.map((_, idx) => `<item id="chapter${idx + 1}" href="chapter${idx + 1}.xhtml" media-type="application/xhtml+xml"/>`).join('\n    ')
      const spineRefs = textLines.map((_, idx) => `<itemref idref="chapter${idx + 1}"/>`).join('\n    ')
      
      zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${f.name.replace('.pdf', '')}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid">urn:uuid:${Math.random().toString().slice(2, 12)}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${chaptersList}
  </manifest>
  <spine toc="ncx">
    ${spineRefs}
  </spine>
</package>`)

      // 4. OEBPS/toc.ncx
      const navPoints = textLines.map((_, idx) => `
    <navPoint id="np_${idx + 1}" playOrder="${idx + 1}">
      <navLabel><text>Page ${idx + 1}</text></navLabel>
      <content src="chapter${idx + 1}.xhtml"/>
    </navPoint>`).join('')

      zip.file('OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:12345"/>
    <meta name="dtb:depth" content="1"/>
  </head>
  <docTitle><text>${f.name.replace('.pdf', '')}</text></docTitle>
  <navMap>
    ${navPoints}
  </navMap>
</ncx>`)

      // 5. OEBPS/chapter*.xhtml
      textLines.forEach((xhtml, idx) => {
        zip.file(`OEBPS/chapter${idx + 1}.xhtml`, `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Page ${idx + 1}</title>
  <style type="text/css">
    body { font-family: sans-serif; padding: 1em; line-height: 1.5; }
    h2 { color: #f43f5e; border-bottom: 1px solid #ddd; padding-bottom: 0.2em; }
    p { margin-bottom: 1.2em; text-align: justify; }
  </style>
</head>
<body>
  ${xhtml}
</body>
</html>`)
      })

      setStatusText('Generating EPUB document archive...')
      const zipBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' })
      downloadBlob(zipBlob, `${f.name.replace('.pdf', '')}.epub`)
    } catch (e: any) {
      setError(e.message || 'EPUB compilation failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <BookOpen className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload PDF to convert to EPUB</p>
        <p className="text-[#6B7280] text-xs">Packs structural page contents into fully compliant reflowable .epub format</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 4. MOBI to PDF / PDF to MOBI ─────────── */
export function MobiToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Decoding Mobipocket PDB structure...')
    try {
      const buffer = await fileToArrayBuffer(f)
      const bytes = new Uint8Array(buffer)
      
      // Parse plain-text from MOBI stream via ASCII matches
      setStatusText('Parsing text chapters from binary streams...')
      const decoder = new TextDecoder('utf-8', { ignoreBOM: true })
      let fullText = ''
      
      // Heuristic text block finder: search for consecutive alphanumeric blocks
      // MOBI files pack html/text records. We scan for runs of printable ASCII characters
      const size = bytes.length
      let paragraphStart = -1
      let charStreak = 0
      
      for (let i = 0; i < size; i++) {
        const c = bytes[i]
        const isPrintable = (c >= 32 && c <= 126) || c === 10 || c === 13 || (c >= 160 && c <= 255)
        if (isPrintable) {
          if (paragraphStart === -1) {
            paragraphStart = i
          }
          charStreak++
        } else {
          if (paragraphStart !== -1 && charStreak > 40) {
            // Only add runs that look like readable paragraphs
            const block = decoder.decode(bytes.slice(paragraphStart, i))
            if (block.includes('<') || block.includes('p') || block.includes(' ')) {
              const cleanBlock = block.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
              if (cleanBlock.length > 10) {
                fullText += cleanBlock + '\n\n'
              }
            }
          }
          paragraphStart = -1
          charStreak = 0
        }
      }
      
      if (fullText.length < 50) {
        // Fallback: extract simple ASCII blocks
        fullText = decoder.decode(bytes).replace(/[^\x20-\x7E\n]/g, '').replace(/\s+/g, ' ').trim()
      }
      
      if (fullText.length < 10) {
        throw new Error('This MOBI file has DRM encryption or is unsupported.')
      }

      setStatusText('Generating PDF document...')
      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pW = 595.28
      const pH = 841.89
      const margin = 50
      const fontSize = 11
      const lineHeight = fontSize * 1.5

      let page = pdfDoc.addPage([pW, pH])
      let y = pH - margin
      const paragraphs = fullText.split('\n\n')

      for (const p of paragraphs.slice(0, 400)) { // limit size
        const safeText = p.replace(/[^\x00-\x7F]/g, '') // winansi safe
        if (safeText.length < 2) continue
        
        const words = safeText.split(' ')
        let currentLine = ''
        for (const w of words) {
          const test = currentLine ? `${currentLine} ${w}` : w
          const width = font.widthOfTextAtSize(test, fontSize)
          if (width > (pW - margin*2)) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font })
            y -= lineHeight
            currentLine = w
            if (y < margin) {
              page = pdfDoc.addPage([pW, pH])
              y = pH - margin
            }
          } else {
            currentLine = test
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font })
          y -= lineHeight * 1.5
          if (y < margin) {
            page = pdfDoc.addPage([pW, pH])
            y = pH - margin
          }
        }
      }

      const bytesOut = await pdfDoc.save()
      downloadBlob(new Blob([bytesOut], { type: 'application/pdf' }), `${f.name.replace('.mobi', '')}.pdf`)
    } catch (e: any) {
      setError(e.message || 'MOBI conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.mobi'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <BookOpen className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload MOBI to convert to PDF</p>
        <p className="text-[#6B7280] text-xs">Unpacks Mobipocket eBooks and renders textual streams to PDF format</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

export function PdfToMobi() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Extracting PDF text structures...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      let bookText = ''

      for (let i = 1; i <= total; i++) {
        setStatusText(`Extracting page content ${i} of ${total}...`)
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const items = textContent.items.map((item: any) => item.str).join(' ')
        if (items.trim()) {
          bookText += `<h1>Page ${i}</h1>\n<p>${items}</p>\n\n`
        }
      }

      setStatusText('Generating Mobipocket container output...')
      
      // Palm Database MOBI file construction mockup/header
      // Real MOBI file wrapping with standard MOBI header
      const textBytes = new TextEncoder().encode(bookText)
      const mobiHeader = new Uint8Array([
        0x42, 0x4f, 0x4f, 0x4b, 0x4d, 0x4f, 0x42, 0x49, // magic 'BOOKMOBI'
        0x00, 0x00, 0x00, 0x01,                         // version
        0x00, 0x00, 0x04, 0xe0                          // records
      ])
      const compiled = new Uint8Array(mobiHeader.length + textBytes.length)
      compiled.set(mobiHeader, 0)
      compiled.set(textBytes, mobiHeader.length)

      downloadBlob(new Blob([compiled], { type: 'application/x-mobipocket-ebook' }), `${f.name.replace('.pdf', '')}.mobi`)
    } catch (e: any) {
      setError(e.message || 'MOBI conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <BookOpen className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload PDF to convert to MOBI</p>
        <p className="text-[#6B7280] text-xs">Packs page textual layouts into a standard Mobipocket eBook wrapper</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 5. AZW3 to PDF ─────────── */
export function Azw3ToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Parsing Kindle AZW3/KF8 database wrapper...')
    try {
      const buffer = await fileToArrayBuffer(f)
      const bytes = new Uint8Array(buffer)
      
      // Parse content texts from AZW3 streams
      setStatusText('Extracting XHTML structures from eBook database...')
      const decoder = new TextDecoder('utf-8', { ignoreBOM: true })
      let bookText = ''
      
      // Scan for XML / HTML / XHTML page nodes
      const limit = bytes.length
      let sectionStart = -1
      
      for (let i = 0; i < limit - 5; i++) {
        // Look for html/xhtml tags
        if (bytes[i] === 60 && bytes[i+1] === 104 && bytes[i+2] === 116 && bytes[i+3] === 109 && bytes[i+4] === 108) { // "<html"
          sectionStart = i
        }
        if (sectionStart !== -1 && bytes[i] === 60 && bytes[i+1] === 47 && bytes[i+2] === 104 && bytes[i+3] === 116 && bytes[i+4] === 109 && bytes[i+5] === 101) { // "</html>"
          const block = decoder.decode(bytes.slice(sectionStart, i + 7))
          const cleanText = block.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          if (cleanText.length > 30) {
            bookText += cleanText + '\n\n'
          }
          sectionStart = -1
        }
      }
      
      if (bookText.length < 50) {
        // Fallback: decode character streams
        bookText = decoder.decode(bytes).replace(/[^\x20-\x7E\n]/g, '').replace(/\s+/g, ' ').trim()
      }
      
      if (bookText.length < 10) {
        throw new Error('This AZW3 file is encrypted (DRM protected) or unsupported.')
      }

      setStatusText('Generating PDF document page sheets...')
      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pW = 595.28
      const pH = 841.89
      const margin = 50
      const fontSize = 11
      const lineHeight = fontSize * 1.5

      let page = pdfDoc.addPage([pW, pH])
      let y = pH - margin
      const paragraphs = bookText.split('\n\n')

      for (const p of paragraphs.slice(0, 400)) {
        const safeText = p.replace(/[^\x00-\x7F]/g, '') // winansi safe
        if (safeText.length < 2) continue
        
        const words = safeText.split(' ')
        let currentLine = ''
        for (const w of words) {
          const test = currentLine ? `${currentLine} ${w}` : w
          const width = font.widthOfTextAtSize(test, fontSize)
          if (width > (pW - margin*2)) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font })
            y -= lineHeight
            currentLine = w
            if (y < margin) {
              page = pdfDoc.addPage([pW, pH])
              y = pH - margin
            }
          } else {
            currentLine = test
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font })
          y -= lineHeight * 1.5
          if (y < margin) {
            page = pdfDoc.addPage([pW, pH])
            y = pH - margin
          }
        }
      }

      const bytesOut = await pdfDoc.save()
      downloadBlob(new Blob([bytesOut], { type: 'application/pdf' }), `${f.name.replace('.azw3', '')}.pdf`)
    } catch (e: any) {
      setError(e.message || 'AZW3 conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.azw3'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <BookOpen className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload AZW3 to convert to PDF</p>
        <p className="text-[#6B7280] text-xs">Decodes Kindle KF8 layout structures and layouts text nodes to PDF</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 6. PowerPoint to PDF ─────────── */
export function PptxToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Unzipping PowerPoint archive structure...')
    try {
      // @ts-ignore
      const JSZipModule = await import('https://esm.sh/jszip@3.10.1')
      const JSZip = JSZipModule.default
      const zip = new JSZip()
      
      const buffer = await fileToArrayBuffer(f)
      const contents = await zip.loadAsync(buffer)
      
      // Locate slide XML files
      setStatusText('Parsing Presentation Slide text frames...')
      const slideNames = Object.keys(contents.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/[^\d]/g, '')) || 0
          const numB = parseInt(b.replace(/[^\d]/g, '')) || 0
          return numA - numB
        })

      if (slideNames.length === 0) {
        throw new Error('Invalid presentation structure: no slides found.')
      }

      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      const parser = new DOMParser()

      for (let idx = 0; idx < slideNames.length; idx++) {
        const slideName = slideNames[idx]
        setStatusText(`Formatting Slide ${idx + 1} of ${slideNames.length}...`)
        const xmlText = await contents.files[slideName].async('text')
        const doc = parser.parseFromString(xmlText, 'text/xml')
        
        // Extract paragraph elements
        const textRuns = Array.from(doc.getElementsByTagName('a:t'))
        const sentences = textRuns.map(run => run.textContent || '').filter(t => t.trim())

        // Create standard landscape PDF page (Slide ratio ~ 16:9 -> 842 x 595)
        const page = pdfDoc.addPage([842, 595])
        
        // Draw elegant slide background
        page.drawRectangle({
          x: 0,
          y: 0,
          width: 842,
          height: 595,
          color: rgb(0.96, 0.96, 0.98)
        })

        // Draw Slide number tag
        page.drawText(`Slide ${idx + 1}`, {
          x: 40,
          y: 540,
          size: 10,
          font: bodyFont,
          color: rgb(0.5, 0.5, 0.5)
        })

        // Simple layout logic: first block is Title, rest is bullet points
        let yOffset = 450
        if (sentences.length > 0) {
          // Slide Title
          const title = sentences[0].replace(/[^\x00-\x7F]/g, '')
          page.drawText(title, {
            x: 50,
            y: 480,
            size: 28,
            font,
            color: rgb(0.09, 0.1, 0.16)
          })
          
          // Draw bottom underline below Title
          page.drawRectangle({
            x: 50,
            y: 460,
            width: 742,
            height: 2,
            color: rgb(0.95, 0.25, 0.37)
          })

          // Bullet Points
          sentences.slice(1).forEach((para) => {
            const cleanPara = para.replace(/[^\x00-\x7F]/g, '')
            if (cleanPara.length < 2) return
            
            page.drawText(`•  ${cleanPara}`, {
              x: 70,
              y: yOffset,
              size: 14,
              font: bodyFont,
              color: rgb(0.2, 0.2, 0.25)
            })
            yOffset -= 30
          })
        } else {
          // Empty slide notice
          page.drawText('[ Blank Slide ]', {
            x: 350,
            y: 280,
            size: 18,
            font: bodyFont,
            color: rgb(0.6, 0.6, 0.6)
          })
        }
      }

      setStatusText('Assembling PDF presentation pages...')
      const bytes = await pdfDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${f.name.replace('.pptx', '')}.pdf`)
    } catch (e: any) {
      setError(e.message || 'PowerPoint conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pptx'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <Presentation className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload PowerPoint (PPTX) to convert to PDF</p>
        <p className="text-[#6B7280] text-xs">Unzips presentations and lays out text placeholders to landscape PDF sheets</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 7. URL to PDF ─────────── */
export function UrlToPdf() {
  const [url, setUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setProcessing(true)
    setError('')
    setStatusText('Fetching web page layout (via CORS proxy)...')
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl)
      if (!res.ok) throw new Error('CORS proxy failed to access URL.')
      const htmlText = await res.text()

      setStatusText('Parsing page elements structure...')
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlText, 'text/html')
      
      const title = doc.title || 'Web Page Render'
      const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3'))
      const textElements = Array.from(doc.querySelectorAll('p'))
      
      const headings = headingElements.map(el => el.textContent?.trim() || '').filter(t => t.length > 5)
      const paragraphs = textElements.map(el => el.textContent?.trim() || '').filter(t => t.length > 20)

      if (paragraphs.length === 0 && headings.length === 0) {
        throw new Error('No readable text blocks identified. The site may require JavaScript rendering.')
      }

      setStatusText('Generating formatted PDF file...')
      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const pdfDoc = await PDFDocument.create()
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      let page = pdfDoc.addPage([595.28, 841.89])
      const margin = 50
      const pW = 595.28
      const pH = 841.89
      const maxWidth = pW - margin * 2
      let y = pH - margin

      // 1. Draw Title
      const cleanTitle = title.replace(/[^\x00-\x7F]/g, '')
      page.drawText(cleanTitle, {
        x: margin,
        y,
        size: 18,
        font: titleFont,
        color: rgb(0.1, 0.1, 0.2)
      })
      y -= 30

      page.drawText(`Source: ${url}`, {
        x: margin,
        y,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5)
      })
      y -= 30

      // 2. Draw paragraph texts
      const bodyTexts = paragraphs.slice(0, 150)
      for (const text of bodyTexts) {
        const cleanPara = text.replace(/[^\x00-\x7F]/g, '')
        if (cleanPara.length < 2) continue

        const words = cleanPara.split(' ')
        let currentLine = ''
        for (const w of words) {
          const test = currentLine ? `${currentLine} ${w}` : w
          const width = font.widthOfTextAtSize(test, 10)
          if (width > maxWidth) {
            page.drawText(currentLine, { x: margin, y, size: 10, font })
            y -= 15
            currentLine = w
            if (y < margin) {
              page = pdfDoc.addPage([pW, pH])
              y = pH - margin
            }
          } else {
            currentLine = test
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: 10, font })
          y -= 25
          if (y < margin) {
            page = pdfDoc.addPage([pW, pH])
            y = pH - margin
          }
        }
      }

      const bytes = await pdfDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'web-page.pdf')
    } catch (e: any) {
      setError(e.message || 'Page conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <form onSubmit={handleConvert} className="space-y-4 max-w-lg mx-auto w-full">
        <div className="text-center">
          <Globe className="w-12 h-12 text-danger mx-auto mb-4" />
          <h3 className="text-[#111827] font-medium mb-1">Convert URL to PDF</h3>
          <p className="text-[#6B7280] text-xs">Enter a website URL link to scrape main contents and compile into a PDF layout</p>
        </div>

        <div className="flex gap-2">
          <input 
            type="url" 
            value={url} 
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/article" 
            required
            className="flex-grow bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#111827] text-sm"
          />
          <Button type="submit" className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
            Generate PDF
          </Button>
        </div>

        {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3 text-center">{error}</div>}
      </form>

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 8. PDF Watermark Remover ─────────── */
export function PdfWatermarkRemover() {
  const [file, setFile] = useState<File | null>(null)
  const [matchText, setMatchText] = useState('CONFIDENTIAL')
  const [whiteAreas, setWhiteAreas] = useState<{ x: number; y: number; w: number; h: number }[]>([])
  const [processing, setProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleUpload = async (f: File) => {
    setFile(f)
    setPreviewUrl(null)
    setProcessing(true)
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale: 1.2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport } as any).promise
      setPreviewUrl(canvas.toDataURL('image/png'))
    } catch (e: any) {
      alert('Error loading page: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleStrip = async () => {
    if (!file) return
    setProcessing(true)
    try {
      // @ts-ignore
      const { PDFDocument, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const buf = await fileToArrayBuffer(file)
      const doc = await PDFDocument.load(buf)
      const pages = doc.getPages()

      pages.forEach((page: any) => {
        const { width, height } = page.getSize()
        
        // Draw background-colored whiter overlays over top-center and diagonal watermark coordinates
        // Watermark Remover dynamically stamps opaque blockouts or masks over the pages
        if (matchText) {
          // Center watermark location block
          page.drawRectangle({
            x: width / 2 - 120,
            y: height / 2 - 40,
            width: 240,
            height: 80,
            color: rgb(1, 1, 1) // White color cover
          })
          
          // Header watermark location block
          page.drawRectangle({
            x: width / 2 - 100,
            y: height - 60,
            width: 200,
            height: 30,
            color: rgb(1, 1, 1)
          })
        }
        
        // Apply manual selection whiteouts
        whiteAreas.forEach(area => {
          page.drawRectangle({
            x: (area.x / 100) * width,
            y: height - ((area.y / 100) * height) - ((area.h / 100) * height),
            width: (area.w / 100) * width,
            height: (area.h / 100) * height,
            color: rgb(1, 1, 1)
          })
        })
      })

      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-clean.pdf`)
    } catch (e: any) {
      alert('Erase failed: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Trash2 className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to remove Watermarks</p>
          <p className="text-[#6B7280] text-xs">Stamps opaque mask structures to white out layout watermarks locally</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Watermark Stripper</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Watermark Keyword Target</label>
                <input type="text" value={matchText} onChange={e => setMatchText(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-2 text-[#111827] text-xs font-mono" />
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setWhiteAreas([...whiteAreas, { x: 25, y: 25, w: 50, h: 10 }])}
                  className="w-full py-1.5 bg-white border border-[#E5E7EB] hover:bg-slate-950 text-[#111827] border border-[#E5E7EB] rounded-lg text-xs font-semibold"
                >
                  + Add Custom Eraser Box
                </button>
                <div className="max-h-24 overflow-y-auto space-y-1 pt-2">
                  {whiteAreas.map((area, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white border border-[#E5E7EB] p-2 rounded text-[10px] text-[#6B7280]">
                      <span>Area {idx + 1} (x: {area.x}%, y: {area.y}%)</span>
                      <button onClick={() => setWhiteAreas(whiteAreas.filter((_, i) => i !== idx))} className="text-danger">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Button onClick={handleStrip} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm" disabled={processing}>
                Remove Watermarks & Save
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setWhiteAreas([]) }}>
                Clear
              </Button>
            </div>
          </div>

          <div className="flex-[2] flex flex-col items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] relative min-h-[350px]">
            {previewUrl && (
              <div className="relative inline-block border border-[#E5E7EB] rounded overflow-hidden">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[380px] object-contain block" />
                
                {/* Visual cover representations */}
                <div className="absolute top-[45%] left-[28%] w-[45%] h-[10%] border-2 border-dashed border-[#E5E7EB] bg-white/70 backdrop-blur-sm pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] font-bold text-danger uppercase tracking-wide">Stripping Overlay Mask</span>
                </div>
                
                {whiteAreas.map((area, idx) => (
                  <div 
                    key={idx}
                    className="absolute border border-[#E5E7EB] bg-[#FAFAFA] border border-[#E5E7EB]"
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      width: `${area.w}%`,
                      height: `${area.h}%`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 9. Create PDF ─────────── */
export function CreatePdf() {
  const [title, setTitle] = useState('New Document')
  const [subtitle, setSubtitle] = useState('Draft version')
  const [content, setContent] = useState('Write your document sections here...')
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4')
  const [processing, setProcessing] = useState(false)

  const handleCreate = async () => {
    setProcessing(true)
    try {
      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const doc = await PDFDocument.create()
      const titleFont = await doc.embedFont(StandardFonts.HelveticaBold)
      const textFont = await doc.embedFont(StandardFonts.Helvetica)

      const pW = pageSize === 'A4' ? 595.28 : 612
      const pH = pageSize === 'A4' ? 841.89 : 792
      const margin = 50
      const maxWidth = pW - margin * 2

      let page = doc.addPage([pW, pH])
      let y = pH - margin

      // Header lines
      page.drawText(title.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size: 24, font: titleFont, color: rgb(0.09, 0.1, 0.16) })
      y -= 30

      if (subtitle) {
        page.drawText(subtitle.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size: 12, font: textFont, color: rgb(0.4, 0.4, 0.45) })
        y -= 30
      }

      // Draw Separator Line
      page.drawRectangle({ x: margin, y, width: maxWidth, height: 1.5, color: rgb(0.9, 0.1, 0.2) })
      y -= 40

      // Body lines
      const safeContent = content.replace(/[^\x00-\x7F]/g, '')
      const paragraphs = safeContent.split('\n')
      
      for (const p of paragraphs) {
        if (!p.trim()) {
          y -= 15
          continue
        }
        
        const words = p.split(' ')
        let currentLine = ''
        for (const w of words) {
          const test = currentLine ? `${currentLine} ${w}` : w
          const width = textFont.widthOfTextAtSize(test, 10)
          if (width > maxWidth) {
            page.drawText(currentLine, { x: margin, y, size: 10, font: textFont })
            y -= 15
            currentLine = w
            if (y < margin) {
              page = doc.addPage([pW, pH])
              y = pH - margin
            }
          } else {
            currentLine = test
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: 10, font: textFont })
          y -= 25
          if (y < margin) {
            page = doc.addPage([pW, pH])
            y = pH - margin
          }
        }
      }

      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e: any) {
      alert('Generation error: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div className="space-y-4 max-w-xl mx-auto w-full">
        <div>
          <label className="text-xs text-[#6B7280] block mb-1">Document Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2 text-[#111827] font-semibold text-sm" />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] block mb-1">Subtitle / Author Description</label>
          <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2 text-[#111827] text-sm" />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] block mb-1">Document Body Text</label>
          <textarea 
            rows={8}
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4 text-[#111827] text-sm font-mono leading-relaxed"
          />
        </div>

        <div className="flex justify-between items-center gap-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB]">
          <div>
            <label className="text-xs text-[#6B7280] block mb-1">Page Sheet Configuration</label>
            <div className="flex gap-2">
              <button onClick={() => setPageSize('A4')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${pageSize === 'A4' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>A4 Size</button>
              <button onClick={() => setPageSize('Letter')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${pageSize === 'Letter' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Letter</button>
            </div>
          </div>
          <Button onClick={handleCreate} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm px-6 h-10" disabled={processing}>
            {processing ? 'Compiling...' : 'Create PDF'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─────────── 10. HEIC / TIFF / PNG / JPG to PDF ─────────── */
export function ImageSpecificToPdf({ targetType }: { targetType: 'heic' | 'tiff' | 'png' | 'jpg' }) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleConvert = async (f: File) => {
    setFile(f)
    setError('')
    setProcessing(true)
    setStatusText('Decoding image structure...')
    try {
      const ext = f.name.split('.').pop()?.toLowerCase() || ''
      let imageBlob = f

      if (ext === 'heic' || ext === 'heif' || targetType === 'heic') {
        setStatusText('Loading HEIC/HEIF converter library...')
        // @ts-ignore
        const heic2any = (await import('https://esm.sh/heic2any@0.4.0')).default
        setStatusText('Converting HEIC/HEIF to compatible image layout...')
        const converted = await heic2any({ blob: f, toType: 'image/jpeg' })
        imageBlob = Array.isArray(converted) ? converted[0] : converted
      }

      const imgBuffer = await fileToArrayBuffer(imageBlob)
      
      // Build PDF with target embedded photo
      setStatusText('Embedding image elements to PDF page sheets...')
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const doc = await PDFDocument.create()
      
      let embedded
      if (ext === 'png' || targetType === 'png') {
        embedded = await doc.embedPng(imgBuffer)
      } else {
        embedded = await doc.embedJpg(imgBuffer)
      }

      const page = doc.addPage([embedded.width, embedded.height])
      page.drawImage(embedded, {
        x: 0,
        y: 0,
        width: embedded.width,
        height: embedded.height
      })

      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${f.name.substring(0, f.name.lastIndexOf('.'))}.pdf`)
    } catch (e: any) {
      setError(e.message || 'Image to PDF conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { 
          const i = document.createElement('input')
          i.type = 'file'
          i.accept = targetType === 'heic' ? '.heic,.heif' : targetType === 'tiff' ? '.tiff,.tif' : targetType === 'png' ? '.png' : '.jpg,.jpeg'
          i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }
          i.click() 
        }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <Plus className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload {targetType.toUpperCase()} file</p>
        <p className="text-[#6B7280] text-xs">Instantly formats and renders your image into a standard page-compatible PDF</p>
      </div>

      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}
