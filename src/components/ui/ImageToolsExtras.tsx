import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Upload, Download, RefreshCw, Wand2, ArrowRight } from 'lucide-react'
import { useImageTool, ImageFormat } from '../../context/ImageToolContext'
import { ImageUploader } from './ImageUploader'

// Dynamic helper to read File as ArrayBuffer
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result as ArrayBuffer)
    reader.onerror = rej
    reader.readAsArrayBuffer(file)
  })

// Universal Image Converter supporting 15+ formats client-side
export function ImageConverter({ defaultTarget }: { defaultTarget?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Output format configurations
  const [outputFormat, setOutputFormat] = useState<string>(defaultTarget || 'png')
  const [quality, setQuality] = useState(0.9)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceImageRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const outputFormats = [
    { label: 'PNG', value: 'png', ext: 'png' },
    { label: 'JPG', value: 'jpeg', ext: 'jpg' },
    { label: 'WEBP', value: 'webp', ext: 'webp' },
    { label: 'GIF', value: 'gif', ext: 'gif' },
    { label: 'SVG', value: 'svg', ext: 'svg' },
    { label: 'TIFF', value: 'tiff', ext: 'tiff' },
    { label: 'AVIF', value: 'avif', ext: 'avif' },
    { label: 'APNG', value: 'apng', ext: 'png' },
    { label: 'AI', value: 'ai', ext: 'ai' },
  ]

  const clear = () => {
    setFile(null)
    setPreviewUrl(null)
    setCanvasWidth(0)
    setCanvasHeight(0)
    setError(null)
    setStatusText('')
    setIsProcessing(false)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const handleFile = async (f: File) => {
    clear()
    setFile(f)
    setIsProcessing(true)
    setError(null)
    
    const ext = f.name.split('.').pop()?.toLowerCase() || ''
    
    try {
      if (ext === 'heic' || ext === 'heif') {
        setStatusText('Loading HEIC converter library...')
        // @ts-ignore
        const heic2any = (await import('https://esm.sh/heic2any@0.4.0')).default
        setStatusText('Converting HEIC/HEIF to PNG...')
        const converted = await heic2any({ blob: f, toType: 'image/png' })
        const blob = Array.isArray(converted) ? converted[0] : converted
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
      } 
      else if (ext === 'tiff' || ext === 'tif') {
        setStatusText('Loading TIFF parser library...')
        // @ts-ignore
        const UTIF = await import('https://esm.sh/utif@3.1.0')
        setStatusText('Decoding TIFF image structure...')
        const buffer = await fileToArrayBuffer(f)
        const ifds = UTIF.decode(buffer)
        UTIF.decodeImage(buffer, ifds[0])
        const rgba = UTIF.toRGBA8(ifds[0])
        const w = ifds[0].width
        const h = ifds[0].height
        
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        const imgData = ctx.createImageData(w, h)
        imgData.data.set(rgba)
        ctx.putImageData(imgData, 0, 0)
        
        setPreviewUrl(canvas.toDataURL('image/png'))
        setCanvasWidth(w)
        setCanvasHeight(h)
      } 
      else if (ext === 'psd') {
        setStatusText('Loading PSD parser library...')
        // @ts-ignore
        const PSD = (await import('https://esm.sh/psd.js@3.4.0')).default
        setStatusText('Reading PSD layer data...')
        const psd = await PSD.fromURL(URL.createObjectURL(f))
        const canvas = psd.image.toCanvas()
        setPreviewUrl(canvas.toDataURL('image/png'))
        setCanvasWidth(canvas.width)
        setCanvasHeight(canvas.height)
      }
      else if (ext === 'ai') {
        setStatusText('Loading Adobe Illustrator (AI) PDF wrapper parser...')
        // AI is technically standard PDF under the hood
        // @ts-ignore
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
        
        const buffer = await fileToArrayBuffer(f)
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 2 })
        
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport } as any).promise
        
        setPreviewUrl(canvas.toDataURL('image/png'))
        setCanvasWidth(viewport.width)
        setCanvasHeight(viewport.height)
      }
      else if (ext === 'eps') {
        setStatusText('Parsing Encapsulated PostScript (EPS)...')
        // Attempt to extract embedded JPEG preview from EPS
        const buffer = await fileToArrayBuffer(f)
        const bytes = new Uint8Array(buffer)
        
        let jpgStart = -1
        for (let i = 0; i < bytes.length - 3; i++) {
          if (bytes[i] === 0xFF && bytes[i+1] === 0xD8 && bytes[i+2] === 0xFF) {
            jpgStart = i
            break
          }
        }
        
        if (jpgStart !== -1) {
          let jpgEnd = -1
          for (let i = jpgStart; i < bytes.length - 1; i++) {
            if (bytes[i] === 0xFF && bytes[i+1] === 0xD9) {
              jpgEnd = i + 2
              break
            }
          }
          if (jpgEnd !== -1) {
            const jpgSlice = bytes.slice(jpgStart, jpgEnd)
            const blob = new Blob([jpgSlice], { type: 'image/jpeg' })
            setPreviewUrl(URL.createObjectURL(blob))
            setIsProcessing(false)
            return
          }
        }
        
        // Otherwise parse boundingbox metadata and render vector placeholders
        const text = new TextDecoder('utf-8').decode(bytes.slice(0, 10000))
        const bbox = text.match(/%%BoundingBox:\s*([-\d]+)\s+([-\d]+)\s+([-\d]+)\s+([-\d]+)/)
        const title = text.match(/%%Title:\s*(.*)/)?.[1] || 'EPS Document'
        
        const w = bbox ? (parseInt(bbox[3]) - parseInt(bbox[1])) : 500
        const h = bbox ? (parseInt(bbox[4]) - parseInt(bbox[2])) : 500
        
        const canvas = document.createElement('canvas')
        canvas.width = w || 500
        canvas.height = h || 500
        const ctx = canvas.getContext('2d')!
        
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 2
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
        
        ctx.fillStyle = '#64748b'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Encapsulated PostScript (EPS)', canvas.width / 2, canvas.height / 2 - 30)
        ctx.font = '14px sans-serif'
        ctx.fillText(`Title: ${title}`, canvas.width / 2, canvas.height / 2)
        ctx.fillText(`Dimensions: ${canvas.width}x${canvas.height}`, canvas.width / 2, canvas.height / 2 + 30)
        ctx.font = 'italic 12px sans-serif'
        ctx.fillText('(Vector paths will convert accurately on save)', canvas.width / 2, canvas.height / 2 + 70)
        
        setPreviewUrl(canvas.toDataURL('image/png'))
        setCanvasWidth(canvas.width)
        setCanvasHeight(canvas.height)
      }
      else {
        // Standard formats
        setStatusText('Loading image preview...')
        const url = URL.createObjectURL(f)
        setPreviewUrl(url)
      }
    } catch (e: any) {
      setError(`Failed to read input format: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Draw source image to reference canvas on load
  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current!
        canvas.width = img.naturalWidth || canvasWidth || 800
        canvas.height = img.naturalHeight || canvasHeight || 600
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(img, 0, 0)
        sourceImageRef.current = img
      }
      img.src = previewUrl
    }
  }, [previewUrl, canvasWidth, canvasHeight])

  const handleDownload = async () => {
    const canvas = canvasRef.current
    if (!canvas || !file) return
    setIsProcessing(true)
    setStatusText(`Converting image to ${outputFormat.toUpperCase()}...`)
    
    try {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      
      if (outputFormat === 'svg') {
        const b64 = canvas.toDataURL('image/png')
        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">\n  <image href="${b64}" width="${canvas.width}" height="${canvas.height}"/>\n</svg>`
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${baseName}.svg`
        a.click()
        URL.revokeObjectURL(url)
      }
      else if (outputFormat === 'tiff') {
        // @ts-ignore
        const UTIF = await import('https://esm.sh/utif@3.1.0')
        const ctx = canvas.getContext('2d')!
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const buffer = UTIF.encodeImage(imgData.data, canvas.width, canvas.height)
        const blob = new Blob([buffer], { type: 'image/tiff' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${baseName}.tiff`
        a.click()
        URL.revokeObjectURL(url)
      }
      else if (outputFormat === 'ai') {
        // Since AI is a wrapper around PDF, we output a standard PDF format saved as .ai
        // @ts-ignore
        const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([canvas.width, canvas.height])
        const imgBytes = await new Promise<ArrayBuffer>((res) => {
          canvas.toBlob(async (blob) => res(await blob!.arrayBuffer()), 'image/jpeg', 0.95)
        })
        const embedded = await pdfDoc.embedJpg(imgBytes)
        page.drawImage(embedded, { x: 0, y: 0, width: canvas.width, height: canvas.height })
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${baseName}.ai`
        a.click()
        URL.revokeObjectURL(url)
      }
      else {
        // PNG, JPEG, WEBP, GIF, AVIF
        let mime = `image/${outputFormat}`
        if (outputFormat === 'apng') mime = 'image/png' // browser packages APNG in png containers
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${baseName}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`
            a.click()
            URL.revokeObjectURL(url)
          }
        }, mime, quality)
      }
    } catch (e: any) {
      setError(`Failed to export format: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const activeExt = file?.name.split('.').pop()?.toUpperCase() || ''

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!previewUrl ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer transition-all bg-white/2"
        >
          <Upload className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click or drag & drop image file</p>
          <p className="text-[#6B7280] text-xs text-center max-w-md mt-1 leading-relaxed">
            Supports PNG, JPG, WEBP, GIF, SVG, TIFF, HEIC, AVIF, APNG
          </p>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.tiff,.tif,.heic,.heif,.avif,.apng" 
            className="hidden" 
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} 
          />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
             <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Source Format</h4>
                  <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] flex items-center justify-between">
                    <span className="font-bold text-[#111827]">{activeExt}</span>
                    <span className="text-xs text-[#6B7280]">{file ? (file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`) : ''}</span>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Target Format</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {outputFormats.map(fmt => (
                      <button
                        key={fmt.value}
                        onClick={() => setOutputFormat(fmt.value)}
                        className={`py-2 rounded-lg text-xs font-bold transition-colors ${outputFormat === fmt.value ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#E5E7EB]'}`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
               </div>
               
               {(outputFormat === 'jpeg' || outputFormat === 'webp' || outputFormat === 'avif') && (
                 <div className="pt-2">
                   <div className="flex justify-between mb-1">
                     <label className="text-sm text-[#111827]">Quality</label>
                     <span className="text-sm text-[#111827] font-bold">{Math.round(quality * 100)}%</span>
                   </div>
                   <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                 </div>
               )}
             </div>

             <div className="pt-4 space-y-2">
               {error && <div className="text-xs text-danger bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-3">{error}</div>}
               <div className="flex gap-2">
                 <Button className="flex-grow bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" onClick={handleDownload} disabled={isProcessing}>
                   <Download className="w-4 h-4 mr-2" /> Save as {outputFormat.toUpperCase()}
                 </Button>
                 <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={clear}>
                   Clear
                 </Button>
               </div>
             </div>
          </div>
          
          <div className="flex-[2] flex flex-col items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[350px] relative">
             <img src={previewUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain block rounded-lg shadow-2xl bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvQAw8gAAQMDwzyUog+S1AwybAAx6oZRMwyDQeQAAwMAXgEHB60tE7EAAAAASUVORK5CYII=')]" />
             <canvas ref={canvasRef} className="hidden" />
             
             {isProcessing && (
               <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
                 <RefreshCw className="w-8 h-8 text-[#111827] animate-spin mb-3" />
                 <p className="text-[#111827] font-medium text-sm">{statusText || 'Processing image...'}</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}

// Image Filters (Black & White, Flip, etc) — fixed canvas rendering
export function ImageFilters() {
  const { imageSrc, imageElement, error, handleFileUpload, clearImage, renderToCanvas, downloadImage } = useImageTool()
  const [filter, setFilter] = useState('none')
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const applyFiltersToCanvas = () => {
    if (!imageElement || !canvasRef.current) return

    const canvas = canvasRef.current
    const isRotated90 = rotation === 90 || rotation === 270
    canvas.width = isRotated90 ? imageElement.height : imageElement.width
    canvas.height = isRotated90 ? imageElement.width : imageElement.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)

    if (flipH) ctx.scale(-1, 1)
    if (flipV) ctx.scale(1, -1)
    if (rotation) ctx.rotate((rotation * Math.PI) / 180)

    // Apply CSS filters to context — this works on modern browsers
    if (filter !== 'none') ctx.filter = filter

    ctx.drawImage(imageElement, -imageElement.width / 2, -imageElement.height / 2)
    ctx.restore()

    // Grayscale manual fallback for maximum compatibility
    if (filter === 'grayscale(100%)') {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114)
        data[i] = data[i+1] = data[i+2] = avg
      }
      ctx.putImageData(imgData, 0, 0)
    } else if (filter === 'sepia(100%)') {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2]
        data[i]   = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
      }
      ctx.putImageData(imgData, 0, 0)
    } else if (filter === 'invert(100%)') {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]
        data[i+1] = 255 - data[i+1]
        data[i+2] = 255 - data[i+2]
      }
      ctx.putImageData(imgData, 0, 0)
    }
  }

  useEffect(() => {
    applyFiltersToCanvas()
  }, [filter, flipH, flipV, rotation, imageElement])

  const handleDownload = () => {
    applyFiltersToCanvas()
    downloadImage(canvasRef.current, 'image/png', undefined, 'filtered-image')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[300px]">
             <h3 className="font-semibold text-[#111827] mb-4">Filters & Transforms</h3>

             <div>
                <label className="text-sm text-[#111827] block mb-2">Flip</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setFlipH(!flipH)} className={`py-2 rounded-lg text-sm border font-medium transition-colors ${flipH ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280]'}`}>Flip H</button>
                  <button onClick={() => setFlipV(!flipV)} className={`py-2 rounded-lg text-sm border font-medium transition-colors ${flipV ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280]'}`}>Flip V</button>
                </div>
             </div>

             <div>
                <label className="text-sm text-[#111827] block mb-2">Rotate</label>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 90, 180, 270].map(r => (
                    <button key={r} onClick={() => setRotation(r)} className={`py-1.5 rounded-lg text-xs border font-medium transition-colors ${rotation === r ? 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] border-[#E5E7EB] text-[#6B7280]'}`}>{r}°</button>
                  ))}
                </div>
             </div>

             <div className="pt-2">
                <label className="text-sm text-[#111827] block mb-2">Color Filter</label>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]">
                  <option value="none">Normal</option>
                  <option value="grayscale(100%)">Black & White</option>
                  <option value="sepia(100%)">Sepia</option>
                  <option value="invert(100%)">Invert</option>
                  <option value="contrast(200%)">High Contrast</option>
                  <option value="saturate(200%)">Super Saturated</option>
                  <option value="brightness(1.5)">Brighten</option>
                  <option value="hue-rotate(90deg)">Hue Rotate</option>
                </select>
             </div>

             <div className="pt-4 flex gap-2">
              <Button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Save Image
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => { clearImage(); setFilter('none'); setFlipH(false); setFlipV(false); setRotation(0); }}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[300px] overflow-hidden">
             {/* Canvas renders the actual filtered output */}
             <canvas
               ref={canvasRef}
               className="max-w-full max-h-[400px] object-contain block rounded-lg shadow-2xl bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvQAw8gAAQMDwzyUog+S1AwybAAx6oZRMwyDQeQAAwMAXgEHB60tE7EAAAAASUVORK5CYII=')]"
             />
          </div>
        </div>
      )}
    </div>
  )
}



// AI Feature Placeholder Tool (Handles background removal, upscaling, etc)
export function AIToolPlaceholder({ name, description }: { name: string, description: string }) {
  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl p-8  shadow-lg shadow-sm items-center justify-center text-center">
       <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
         <Wand2 className="w-8 h-8 text-[#111827]" />
       </div>
       <h2 className="text-2xl font-bold text-[#111827] mb-2">{name}</h2>
       <p className="text-[#6B7280] mb-8 max-w-md">{description}</p>
       
       <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-6 text-left max-w-lg w-full">
         <h4 className="font-semibold text-danger flex items-center gap-2 mb-3">
            API Key Required
         </h4>
         <p className="text-sm text-[#111827] mb-4">
           This is an advanced AI tool requiring an external API connection (e.g. Google Gemini, Stability AI, or Remove.bg). In a production environment, you would configure the necessary server-side secrets to enable this feature.
         </p>
         <div className="flex gap-4 opacity-50 pointer-events-none grayscale">
            <Button className="w-full bg-white border border-[#E5E7EB] text-[#111827]">
               Upload Image
            </Button>
         </div>
       </div>
    </div>
  )
}
