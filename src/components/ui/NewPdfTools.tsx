import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, Trash2, ArrowLeft, ArrowRight, PenTool, CheckCircle, FileText, Copy } from 'lucide-react'
import { Button } from './button'

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result as ArrayBuffer)
    reader.onerror = rej
    reader.readAsArrayBuffer(file)
  })

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/* ─────────── 1. PDF Page Organizer ─────────── */
export function PdfOrganizer() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<{ id: number; dataUrl: string; pageIndex: number }[]>([])
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async (f: File) => {
    setFile(f)
    setPages([])
    setProcessing(true)
    setError('')
    setStatusText('Loading PDF page renderer...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      const results: typeof pages = []

      for (let i = 1; i <= total; i++) {
        setStatusText(`Rendering page ${i} of ${total}...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.5 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport } as any).promise
        results.push({ id: Math.random(), dataUrl: canvas.toDataURL('image/jpeg', 0.6), pageIndex: i - 1 })
      }
      setPages(results)
    } catch (e: any) {
      setError('Failed to parse PDF: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const moveLeft = (index: number) => {
    if (index === 0) return
    setPages(prev => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index - 1]
      copy[index - 1] = temp
      return copy
    })
  }

  const moveRight = (index: number) => {
    if (index === pages.length - 1) return
    setPages(prev => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index + 1]
      copy[index + 1] = temp
      return copy
    })
  }

  const removePage = (index: number) => {
    setPages(prev => prev.filter((_, i) => i !== index))
  }

  const compilePdf = async () => {
    if (!file || pages.length === 0) return
    setProcessing(true)
    setStatusText('Rebuilding PDF pages...')
    try {
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const originalBuf = await fileToArrayBuffer(file)
      const originalDoc = await PDFDocument.load(originalBuf)
      const newDoc = await PDFDocument.create()

      const copiedPages = await newDoc.copyPages(originalDoc, pages.map(p => p.pageIndex))
      copiedPages.forEach((page: any) => newDoc.addPage(page))

      const bytes = await newDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-reordered.pdf`)
    } catch (e: any) {
      setError('Compilation error: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Upload className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to reorder/delete pages</p>
          <p className="text-[#6B7280] text-xs">Processing runs strictly client-side</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">{pages.length} pages in workspace from <span className="text-[#111827] font-medium">{file.name}</span></span>
            <div className="flex gap-2">
              <Button onClick={compilePdf} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" disabled={processing}>
                Save & Download PDF
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-[#111827] text-sm" onClick={clear}>
                Reset
              </Button>
            </div>
          </div>
          
          {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-auto max-h-[450px] p-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
            {pages.map((p, idx) => (
              <div key={p.id} className="bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col relative group">
                <img src={p.dataUrl} alt={`Page ${idx + 1}`} className="w-full h-40 object-contain bg-white" />
                <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold text-[#111827]">Page {p.pageIndex + 1}</div>
                <div className="flex items-center justify-between p-2 pt-1 border-t border-[#E5E7EB] bg-slate-950/20">
                  <div className="flex gap-0.5">
                    <button onClick={() => moveLeft(idx)} className="p-1 hover:bg-white/10 rounded text-[#6B7280] hover:text-[#111827]" disabled={idx === 0}>←</button>
                    <button onClick={() => moveRight(idx)} className="p-1 hover:bg-white/10 rounded text-[#6B7280] hover:text-[#111827]" disabled={idx === pages.length - 1}>→</button>
                  </div>
                  <button onClick={() => removePage(idx)} className="p-1.5 hover:bg-[#FAFAFA] border border-[#E5E7EB] rounded text-danger hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
  
  function clear() {
    setFile(null)
    setPages([])
    setError('')
  }
}

import { RefreshCw } from 'lucide-react'

/* ─────────── 2. PDF Signature Tool ─────────── */
export function PdfSigner() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfDocInstance, setPdfDocInstance] = useState<any>(null)
  
  // Signature Drawing State
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw')
  const [signatureImg, setSignatureImg] = useState<string | null>(null)
  const [signaturePos, setSignaturePos] = useState({ x: 50, y: 50 })
  const [sigScale, setSigScale] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  
  const drawCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureImg(null)
  }

  // Handle Drawing signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000000'
    
    const { x, y } = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const { x, y } = getCanvasCoords(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    isDrawing.current = false
    const canvas = drawCanvasRef.current
    if (canvas) {
      setSignatureImg(canvas.toDataURL('image/png'))
    }
  }

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handleUploadPDF = async (f: File) => {
    setFile(f)
    setIsProcessing(true)
    setStatusText('Loading PDF page...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      setTotalPages(pdf.numPages)
      setPdfDocInstance(pdf)
      await renderPage(pdf, 0)
    } catch (e: any) {
      alert('Failed to load PDF: ' + e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPage = async (pdf: any, idx: number) => {
    const page = await pdf.getPage(idx + 1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport } as any).promise
    setPreviewUrl(canvas.toDataURL('image/png'))
  }

  const changePage = async (offset: number) => {
    const nextIdx = pageIndex + offset
    if (nextIdx >= 0 && nextIdx < totalPages) {
      setPageIndex(nextIdx)
      await renderPage(pdfDocInstance, nextIdx)
    }
  }

  const applySignature = async () => {
    if (!file || !signatureImg) return
    setIsProcessing(true)
    setStatusText('Applying signature to PDF...')
    try {
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const buf = await fileToArrayBuffer(file)
      const pdfDoc = await PDFDocument.load(buf)
      const page = pdfDoc.getPages()[pageIndex]
      
      const sigData = signatureImg.split(',')[1]
      const sigBytes = Uint8Array.from(atob(sigData), c => c.charCodeAt(0))
      const sigImage = await pdfDoc.embedPng(sigBytes)
      
      const { width, height } = page.getSize()
      
      // Calculate coordinates scaled to pdf-lib grid (0,0 is bottom left)
      const w = 150 * sigScale
      const h = 75 * sigScale
      const pdfX = (signaturePos.x / 100) * width - w/2
      const pdfY = height - ((signaturePos.y / 100) * height) - h/2
      
      page.drawImage(sigImage, {
        x: Math.max(0, Math.min(pdfX, width - w)),
        y: Math.max(0, Math.min(pdfY, height - h)),
        width: w,
        height: h
      })
      
      const bytes = await pdfDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-signed.pdf`)
    } catch (e: any) {
      alert('Error signing: ' + e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUploadPDF((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <PenTool className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to sign</p>
          <p className="text-[#6B7280] text-xs">Draw signature or upload transparent PNG</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Controls */}
          <div className="flex-1 w-full md:w-80 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Signature Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setSignatureMode('draw'); setSignatureImg(null) }} className={`py-1.5 rounded-lg text-xs font-bold ${signatureMode === 'draw' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Draw</button>
                  <button onClick={() => { setSignatureMode('upload'); setSignatureImg(null) }} className={`py-1.5 rounded-lg text-xs font-bold ${signatureMode === 'upload' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Upload</button>
                </div>
              </div>
              
              {signatureMode === 'draw' ? (
                <div>
                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Draw Here</h4>
                  <canvas 
                    ref={drawCanvasRef}
                    width={250}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg cursor-crosshair"
                  />
                  <button onClick={clearCanvas} className="text-xs text-[#6B7280] hover:text-[#111827] mt-1">Clear Canvas</button>
                </div>
              ) : (
                <div>
                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Select PNG</h4>
                  <input 
                    type="file" 
                    accept="image/png"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) {
                        const reader = new FileReader()
                        reader.onload = val => setSignatureImg(val.target?.result as string)
                        reader.readAsDataURL(f)
                      }
                    }}
                    className="w-full text-xs bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-2 text-[#6B7280]"
                  />
                </div>
              )}
              
              {signatureImg && (
                <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Placement Controls</h4>
                  <div>
                    <label className="text-xs text-[#6B7280] flex justify-between">X Placement: <span>{signaturePos.x}%</span></label>
                    <input type="range" min="0" max="100" value={signaturePos.x} onChange={e => setSignaturePos(p => ({ ...p, x: parseInt(e.target.value) }))} className="w-full accent-rose-500" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] flex justify-between">Y Placement: <span>{signaturePos.y}%</span></label>
                    <input type="range" min="0" max="100" value={signaturePos.y} onChange={e => setSignaturePos(p => ({ ...p, y: parseInt(e.target.value) }))} className="w-full accent-rose-500" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] flex justify-between">Size Scale: <span>{sigScale.toFixed(2)}x</span></label>
                    <input type="range" min="0.5" max="3" step="0.1" value={sigScale} onChange={e => setSigScale(parseFloat(e.target.value))} className="w-full accent-rose-500" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 pt-4">
              <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" onClick={applySignature} disabled={!signatureImg}>
                Stamp & Download
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null); setSignatureImg(null) }}>
                Clear File
              </Button>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="flex-[2] flex flex-col items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[350px] relative">
            <div className="flex justify-between items-center w-full mb-3">
              <span className="text-xs text-[#6B7280]">Page {pageIndex + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => changePage(-1)} disabled={pageIndex === 0} className="px-2 py-1 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded text-xs text-[#6B7280] hover:text-[#111827] disabled:opacity-50">Prev</button>
                <button onClick={() => changePage(1)} disabled={pageIndex === totalPages - 1} className="px-2 py-1 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded text-xs text-[#6B7280] hover:text-[#111827] disabled:opacity-50">Next</button>
              </div>
            </div>
            
            {previewUrl && (
              <div className="relative inline-block border border-[#E5E7EB] rounded overflow-hidden">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain block" />
                {signatureImg && (
                  <div 
                    className="absolute border border-[#E5E7EB] bg-[#FAFAFA] border border-[#E5E7EB] pointer-events-none"
                    style={{
                      left: `${signaturePos.x}%`,
                      top: `${signaturePos.y}%`,
                      width: `${120 * sigScale}px`,
                      height: `${60 * sigScale}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img src={signatureImg} alt="Signature Placement" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 3. EPUB to PDF Converter ─────────── */
export function EpubToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const handleUpload = async (f: File) => {
    setFile(f)
    setError(null)
    setIsProcessing(true)
    setStatusText('Unzipping EPUB container...')
    
    try {
      // @ts-ignore
      const JSZipModule = await import('https://esm.sh/jszip@3.10.1')
      const JSZip = JSZipModule.default
      const zip = new JSZip()
      
      const buffer = await fileToArrayBuffer(f)
      const contents = await zip.loadAsync(buffer)
      
      // Parse content OPF
      let opfPath = ''
      const files = Object.keys(contents.files)
      
      const containerFile = files.find(name => name.endsWith('container.xml'))
      if (containerFile) {
        const text = await contents.files[containerFile].async('text')
        const match = text.match(/full-path="([^"]+)"/)
        if (match) opfPath = match[1]
      }
      
      if (!opfPath) {
        opfPath = files.find(name => name.endsWith('.opf')) || ''
      }
      
      if (!opfPath) {
        throw new Error('Invalid EPUB: Missing package descriptor (.opf)')
      }
      
      setStatusText('Reading eBook manifest...')
      const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1)
      const opfText = await contents.files[opfPath].async('text')
      const parser = new DOMParser()
      const opfDoc = parser.parseFromString(opfText, 'text/xml')
      
      const spineItems = Array.from(opfDoc.getElementsByTagName('itemref'))
      const manifestItems = Array.from(opfDoc.getElementsByTagName('item'))
      
      const textChapters: string[] = []
      
      for (const item of spineItems) {
        const idref = item.getAttribute('idref')
        const manifestItem = manifestItems.find(m => m.getAttribute('id') === idref)
        if (manifestItem) {
          const href = manifestItem.getAttribute('href') || ''
          const relativePath = opfDir + href
          const normalizedPath = relativePath.replace(/^\//, '')
          
          if (contents.files[normalizedPath]) {
            setStatusText(`Parsing chapter content: ${href}...`)
            const chapterHtml = await contents.files[normalizedPath].async('text')
            const chapDoc = parser.parseFromString(chapterHtml, 'text/html')
            const textLines = Array.from(chapDoc.body.querySelectorAll('p, h1, h2, h3'))
              .map(el => el.textContent?.trim() || '')
              .filter(el => el.length > 2)
            
            textChapters.push(...textLines)
          }
        }
      }
      
      if (textChapters.length === 0) {
        // Fallback search
        const htmlFiles = files.filter(f => f.endsWith('.xhtml') || f.endsWith('.html'))
        for (const path of htmlFiles.slice(0, 5)) {
          const text = await contents.files[path].async('text')
          const chapDoc = parser.parseFromString(text, 'text/html')
          textChapters.push(...Array.from(chapDoc.body.querySelectorAll('p, h1, h2, h3')).map(el => el.textContent?.trim() || ''))
        }
      }
      
      setStatusText('Generating PDF document...')
      // Compile extracted text to PDF pages
      // @ts-ignore
      const { PDFDocument, StandardFonts, rgb } = await import('https://esm.sh/pdf-lib@1.17.1')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      let page = pdfDoc.addPage([595.28, 841.89]) // A4
      let yOffset = 780
      
      const textToDraw = textChapters.slice(0, 500) // limit size client-side
      
      for (const paragraph of textToDraw) {
        const cleanText = paragraph.replace(/[^\x00-\x7F]/g, '') // remove unicode characters
        if (cleanText.length < 2) continue
        
        // Simple line wrap
        const words = cleanText.split(' ')
        let currentLine = ''
        
        for (const word of words) {
          const test = currentLine ? `${currentLine} ${word}` : word
          const width = font.widthOfTextAtSize(test, 11)
          if (width > 495) {
            page.drawText(currentLine, { x: 50, y: yOffset, size: 11, font, color: rgb(0,0,0) })
            yOffset -= 18
            currentLine = word
            
            if (yOffset < 50) {
              page = pdfDoc.addPage([595.28, 841.89])
              yOffset = 780
            }
          } else {
            currentLine = test
          }
        }
        
        if (currentLine) {
          page.drawText(currentLine, { x: 50, y: yOffset, size: 11, font, color: rgb(0,0,0) })
          yOffset -= 30
          if (yOffset < 50) {
            page = pdfDoc.addPage([595.28, 841.89])
            yOffset = 780
          }
        }
      }
      
      const bytes = await pdfDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${f.name.replace('.epub', '')}.pdf`)
    } catch (e: any) {
      setError(`Failed to convert: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.epub'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <FileText className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload EPUB to PDF Converter</p>
        <p className="text-[#6B7280] text-xs">Converts ebooks to clean formatted standard PDF layout</p>
      </div>
      
      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 4. PDF Grayscale Converter ─────────── */
export function PdfGrayscale() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const handleUpload = async (f: File) => {
    setFile(f)
    setError(null)
    setIsProcessing(true)
    setStatusText('Loading PDF page renderer...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const newDoc = await PDFDocument.create()

      for (let i = 1; i <= total; i++) {
        setStatusText(`Desaturating page ${i} of ${total}...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport } as any).promise
        
        // Convert canvas image to grayscale
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imgData.data
        for (let j = 0; j < d.length; j += 4) {
          const v = d[j] * 0.299 + d[j+1] * 0.587 + d[j+2] * 0.114
          d[j] = d[j+1] = d[j+2] = v
        }
        ctx.putImageData(imgData, 0, 0)
        
        // Convert to JPG bytes and load page inside the new PDF
        const imgBytes = await new Promise<ArrayBuffer>(res => {
          canvas.toBlob(async (blob) => res(await blob!.arrayBuffer()), 'image/jpeg', 0.90)
        })
        const embedded = await newDoc.embedJpg(imgBytes)
        
        const newPage = newDoc.addPage([viewport.width, viewport.height])
        newPage.drawImage(embedded, { x: 0, y: 0, width: viewport.width, height: viewport.height })
      }
      
      setStatusText('Compiling grayscale document...')
      const bytes = await newDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${f.name.replace('.pdf', '')}-grayscale.pdf`)
    } catch (e: any) {
      setError(`Grayscale conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <Upload className="w-12 h-12 text-danger mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload PDF to make Grayscale</p>
        <p className="text-[#6B7280] text-xs">Converts all colored sections and images into high-contrast grayscale</p>
      </div>
      
      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 5. PDF Metadata Editor ─────────── */
export function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({ title: '', author: '', subject: '', creator: '', producer: '', keywords: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (f: File) => {
    setFile(f)
    setError(null)
    setIsProcessing(true)
    setStatusText('Reading metadata...')
    try {
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const buf = await fileToArrayBuffer(f)
      const pdfDoc = await PDFDocument.load(buf)
      setMetadata({
        title: pdfDoc.getTitle() || '',
        author: pdfDoc.getAuthor() || '',
        subject: pdfDoc.getSubject() || '',
        creator: pdfDoc.getCreator() || '',
        producer: pdfDoc.getProducer() || '',
        keywords: pdfDoc.getKeywords() || ''
      })
    } catch (e: any) {
      setError(`Failed to read PDF: ${e.message}`)
      setFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const saveMetadata = async () => {
    if (!file) return
    setIsProcessing(true)
    setStatusText('Saving metadata...')
    try {
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const buf = await fileToArrayBuffer(file)
      const pdfDoc = await PDFDocument.load(buf)
      
      if (metadata.title) pdfDoc.setTitle(metadata.title)
      if (metadata.author) pdfDoc.setAuthor(metadata.author)
      if (metadata.subject) pdfDoc.setSubject(metadata.subject)
      if (metadata.creator) pdfDoc.setCreator(metadata.creator)
      if (metadata.producer) pdfDoc.setProducer(metadata.producer)
      if (metadata.keywords) pdfDoc.setKeywords([metadata.keywords])

      const bytes = await pdfDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-meta.pdf`)
    } catch (e: any) {
      setError(`Failed to save PDF: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearMetadata = () => {
    setMetadata({ title: '', author: '', subject: '', creator: '', producer: '', keywords: '' })
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <FileText className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF to Edit Metadata</p>
          <p className="text-[#6B7280] text-xs">Read, edit, or strip metadata for privacy</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#111827] font-semibold">{file.name}</h3>
            <Button variant="outline" size="sm" onClick={() => setFile(null)} className="text-[#6B7280]">Change File</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['title', 'author', 'subject', 'creator', 'producer', 'keywords'] as const).map(key => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-[#6B7280] uppercase font-semibold">{key}</label>
                <input 
                  type="text" 
                  value={metadata[key]}
                  onChange={e => setMetadata(prev => ({ ...prev, [key]: e.target.value }))}
                  className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg p-2 text-[#111827] focus:outline-none focus:ring-1 focus:ring-danger"
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button onClick={saveMetadata} disabled={isProcessing} className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">Save & Download</Button>
            <Button onClick={clearMetadata} variant="outline" className="text-danger border-danger/20 hover:bg-danger/10">Strip All Metadata</Button>
          </div>
        </div>
      )}
      
      {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg p-3">{error}</div>}
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 6. Extract PDF Pages ─────────── */
export function ExtractPdfPages() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<{ id: number; dataUrl: string; pageIndex: number; selected: boolean }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (f: File) => {
    setFile(f)
    setPages([])
    setError(null)
    setIsProcessing(true)
    setStatusText('Loading PDF pages...')
    try {
      // @ts-ignore
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await fileToArrayBuffer(f)
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
      const total = pdf.numPages
      const results: typeof pages = []

      for (let i = 1; i <= total; i++) {
        setStatusText(`Rendering page ${i} of ${total}...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.5 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport } as any).promise
        results.push({ id: Math.random(), dataUrl: canvas.toDataURL('image/jpeg', 0.6), pageIndex: i - 1, selected: false })
      }
      setPages(results)
    } catch (e: any) {
      setError(`Failed to parse PDF: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const togglePage = (index: number) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p))
  }

  const extractPages = async () => {
    const selectedIndices = pages.filter(p => p.selected).map(p => p.pageIndex)
    if (!file || selectedIndices.length === 0) return
    
    setIsProcessing(true)
    setStatusText('Extracting selected pages...')
    try {
      // @ts-ignore
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      const buf = await fileToArrayBuffer(file)
      const originalDoc = await PDFDocument.load(buf)
      const newDoc = await PDFDocument.create()

      const copiedPages = await newDoc.copyPages(originalDoc, selectedIndices)
      copiedPages.forEach((page: any) => newDoc.addPage(page))

      const bytes = await newDoc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-extracted.pdf`)
    } catch (e: any) {
      setError(`Extraction error: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Copy className="w-12 h-12 text-danger mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload PDF</p>
          <p className="text-[#6B7280] text-xs">Select pages to extract into a new document</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Select the pages you want to keep from <span className="text-[#111827] font-medium">{file.name}</span></span>
            <div className="flex gap-2">
              <Button onClick={extractPages} disabled={!pages.some(p => p.selected) || isProcessing} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">
                Extract {pages.filter(p => p.selected).length} Pages
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-[#111827] text-sm" onClick={() => setFile(null)}>
                Change File
              </Button>
            </div>
          </div>
          
          {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-auto max-h-[450px] p-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
            {pages.map((p, idx) => (
              <div 
                key={p.id} 
                onClick={() => togglePage(idx)}
                className={`cursor-pointer border-2 rounded-xl overflow-hidden flex flex-col relative group transition-colors ${p.selected ? 'border-danger' : 'border-[#E5E7EB] hover:border-[#E5E7EB]'}`}
              >
                <img src={p.dataUrl} alt={`Page ${p.pageIndex + 1}`} className={`w-full h-40 object-contain bg-white ${p.selected ? 'opacity-100' : 'opacity-70'}`} />
                <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold text-[#111827]">Page {p.pageIndex + 1}</div>
                {p.selected && (
                  <div className="absolute inset-0 bg-danger/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-danger bg-black/50 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-danger animate-spin mb-3" />
          <p className="text-[#111827] font-medium">{statusText}</p>
        </div>
      )}
    </div>
  )
}
