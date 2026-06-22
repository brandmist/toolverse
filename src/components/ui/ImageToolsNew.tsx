import { useState, useRef, useEffect, useCallback } from 'react'
import { Download, Upload, Image as ImageIcon, Archive } from 'lucide-react'
import { Button } from './button'
import JSZip from 'jszip'

/* ─────────────────────────────────────────────────────────────────────────────
   Shared drag-and-drop uploader component (used across tools below)
───────────────────────────────────────────────────────────────────────────── */
function FileDropZone({
  accept,
  multiple = false,
  onFiles,
  label = 'Click or drag & drop image here',
  sub = 'PNG, JPG, WEBP, GIF supported',
}: {
  accept: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  label?: string
  sub?: string
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = (files: FileList | null) => {
    if (files && files.length > 0) onFiles(Array.from(files))
  }

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${dragging ? 'border-border bg-surface border border-border' : 'border-white/10 hover:border-white/30 bg-white/3'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
    >
      <Upload className="w-10 h-10 text-text-muted mb-4" />
      <p className="text-text-primary font-medium mb-1">{label}</p>
      <p className="text-text-muted text-sm">{sub}</p>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e => handle(e.target.files)} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. Image Compressor — Bulk Canvas quality slider
───────────────────────────────────────────────────────────────────────────── */
export function ImageCompressor() {
  type ImgState = { id: string; file: File; src: string; origSize: number; compressed: { url: string; size: number; blob: Blob } | null; processing: boolean }
  const [images, setImages] = useState<ImgState[]>([])
  const [quality, setQuality] = useState(0.75)
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg')
  const [isZipping, setIsZipping] = useState(false)

  // Use a ref to store current settings so compressSingle closure gets the latest
  const settingsRef = useRef({ format, quality })
  useEffect(() => { settingsRef.current = { format, quality } }, [format, quality])

  const compressSingle = useCallback((img: ImgState, fmt: string, qual: number) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(image, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) {
          setImages(curr => curr.map(c => c.id === img.id ? { ...c, processing: false } : c))
          return
        }
        setImages(curr => curr.map(c => c.id === img.id ? { ...c, compressed: { url: URL.createObjectURL(blob), size: blob.size, blob }, processing: false } : c))
      }, fmt, qual)
    }
    image.src = img.src
  }, [])

  const onFiles = (files: File[]) => {
    const newImages = files.map(f => ({
      id: Math.random().toString(36).substring(2),
      file: f,
      src: URL.createObjectURL(f),
      origSize: f.size,
      compressed: null,
      processing: true
    }))
    setImages(prev => [...prev, ...newImages])
    
    // Process new images
    newImages.forEach(img => compressSingle(img, settingsRef.current.format, settingsRef.current.quality))
  }

  // When quality/format changes, recompress all
  useEffect(() => {
    if (images.length === 0) return;
    setImages(curr => curr.map(c => ({ ...c, processing: true, compressed: null })))
    // Need a timeout to allow UI to render the 'Processing...' state before locking the main thread with canvas operations
    setTimeout(() => {
      setImages(curr => {
         curr.forEach(img => compressSingle(img, format, quality))
         return curr
      })
    }, 50)
  }, [quality, format, compressSingle])

  const downloadZip = async () => {
    setIsZipping(true)
    try {
      const zip = new JSZip()
      images.forEach((img) => {
        if (img.compressed) {
           const ext = format === 'image/jpeg' ? 'jpg' : 'webp';
           const originalName = img.file.name.replace(/\.[^/.]+$/, "");
           zip.file(`${originalName}-compressed.${ext}`, img.compressed.blob)
        }
      })
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `compressed-images-${Date.now()}.zip`
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsZipping(false)
    }
  }

  const fmt = (n: number) => n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`
  
  const totalOrigSize = images.reduce((acc, img) => acc + img.origSize, 0)
  const totalCompSize = images.reduce((acc, img) => acc + (img.compressed?.size || 0), 0)
  const totalSavings = totalCompSize ? Math.max(0, Math.round((1 - totalCompSize / totalOrigSize) * 100)) : 0
  const allDone = images.length > 0 && images.every(img => !img.processing && img.compressed)

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      {!images.length ? (
        <FileDropZone accept="image/*,.svg,.tiff,.tif,.heic,.avif" multiple={true} onFiles={onFiles} label="Drop images to compress" sub="Bulk compress PNG, JPG, WEBP — up to 50MB each" />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Controls */}
            <div className="flex-shrink-0 w-full md:w-80 space-y-5 bg-surface border border-border border-white/5 rounded-xl p-5">
              <h3 className="font-semibold text-text-primary">Compression Settings</h3>
              <div>
                <label className="text-sm text-text-primary block mb-2">Output Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['image/jpeg', 'image/webp'] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)} className={`py-2 rounded-lg text-sm border font-medium transition-colors ${format === f ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}>
                      {f === 'image/jpeg' ? 'JPG' : 'WEBP'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-text-primary">Quality</label>
                  <span className="text-sm font-bold text-text-primary">{Math.round(quality * 100)}%</span>
                </div>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Smaller</span><span>Better Quality</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Files</span>
                  <span className="text-text-primary font-medium">{images.length} images</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Original Size</span>
                  <span className="text-text-primary font-medium">{fmt(totalOrigSize)}</span>
                </div>
                {totalCompSize > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Compressed Size</span>
                      <span className="text-success font-medium">{fmt(totalCompSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Total Saved</span>
                      <span className={`font-bold ${totalSavings > 0 ? 'text-success' : 'text-warning'}`}>{totalSavings}%</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full bg-card border border-border hover:bg-card-hover text-text-primary" onClick={downloadZip} disabled={!allDone || isZipping}>
                  {isZipping ? <span className="flex items-center gap-2">Zipping...</span> : <><Archive className="w-4 h-4 mr-2" /> Download All (ZIP)</>}
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setImages([])}>Clear All</Button>
              </div>

              <div className="pt-2">
                 <FileDropZone accept="image/*,.svg,.tiff,.tif,.heic,.avif" multiple={true} onFiles={onFiles} label="Add more images" sub="" />
              </div>
            </div>

            {/* List Preview */}
            <div className="flex-grow space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {images.map(img => {
                const savings = img.compressed ? Math.max(0, Math.round((1 - img.compressed.size / img.origSize) * 100)) : 0
                return (
                  <div key={img.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3 shadow-sm border-white/5">
                    <img src={img.src} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-medium text-text-primary truncate">{img.file.name}</div>
                       <div className="text-xs text-text-muted mt-1">
                          {fmt(img.origSize)} 
                          {img.compressed && <span> → <span className="text-success font-medium">{fmt(img.compressed.size)}</span></span>}
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       {img.processing ? (
                         <div className="text-xs text-text-muted animate-pulse">Processing...</div>
                       ) : img.compressed ? (
                         <>
                           <span className={`text-xs font-bold ${savings > 0 ? 'text-success' : 'text-warning'}`}>-{savings}%</span>
                           <a href={img.compressed.url} download={`${img.file.name.replace(/\.[^/.]+$/, "")}-compressed.${format === 'image/jpeg' ? 'jpg' : 'webp'}`}>
                             <Button size="sm" variant="outline" className="p-2 border-white/10 hover:bg-white/10 text-text-primary">
                               <Download className="w-4 h-4" />
                             </Button>
                           </a>
                         </>
                       ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. Image Watermark — text watermark drawn on canvas
───────────────────────────────────────────────────────────────────────────── */
export function ImageWatermark() {
  const [src, setSrc] = useState<string | null>(null)
  const [text, setText] = useState('© SmarTools')
  const [fontSize, setFontSize] = useState(36)
  const [opacity, setOpacity] = useState(0.5)
  const [position, setPosition] = useState<'center' | 'br' | 'bl' | 'tr' | 'tl' | 'tile'>('br')
  const [color, setColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWatermark = useCallback(() => {
    if (!src || !canvasRef.current) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      ctx.globalAlpha = opacity
      ctx.fillStyle = color
      ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const margin = 20
      const tw = ctx.measureText(text).width
      const th = fontSize

      const positions: Record<string, [number, number]> = {
        center: [canvas.width / 2, canvas.height / 2],
        br: [canvas.width - tw / 2 - margin, canvas.height - th / 2 - margin],
        bl: [tw / 2 + margin, canvas.height - th / 2 - margin],
        tr: [canvas.width - tw / 2 - margin, th / 2 + margin],
        tl: [tw / 2 + margin, th / 2 + margin],
      }

      if (position === 'tile') {
        const stepX = tw + 80
        const stepY = th + 60
        for (let y = 0; y < canvas.height + stepY; y += stepY) {
          for (let x = 0; x < canvas.width + stepX; x += stepX) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(-Math.PI / 6)
            ctx.fillText(text, 0, 0)
            ctx.restore()
          }
        }
      } else {
        const [px, py] = positions[position]
        ctx.fillText(text, px, py)
      }

      ctx.globalAlpha = 1
    }
    img.src = src
  }, [src, text, fontSize, opacity, position, color])

  useEffect(() => { drawWatermark() }, [drawWatermark])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'watermarked.png'
    a.click()
  }

  const positions = [
    { id: 'tl', label: '↖ Top Left' }, { id: 'tr', label: '↗ Top Right' },
    { id: 'center', label: '⊕ Center' }, { id: 'tile', label: '⋯ Tile' },
    { id: 'bl', label: '↙ Bot Left' }, { id: 'br', label: '↘ Bot Right' },
  ]

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      {!src ? (
        <FileDropZone accept="image/*,.svg,.tiff,.tif,.heic,.avif" onFiles={f => { const r = new FileReader(); r.onload = e => setSrc(e.target?.result as string); r.readAsDataURL(f[0]) }} label="Drop image to watermark" />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-full md:w-72 space-y-4 bg-surface border border-border border-white/5 rounded-xl p-5">
            <h3 className="font-semibold text-text-primary">Watermark Settings</h3>
            <div>
              <label className="text-sm text-text-primary block mb-1">Watermark Text</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-text-primary">Font Size</label><span className="text-sm text-text-muted">{fontSize}px</span></div>
              <input type="range" min="12" max="120" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm text-text-primary">Opacity</label><span className="text-sm text-text-muted">{Math.round(opacity * 100)}%</span></div>
              <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-text-primary block mb-1">Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
            </div>
            <div>
              <label className="text-sm text-text-primary block mb-2">Position</label>
              <div className="grid grid-cols-3 gap-1">
                {positions.map(p => (
                  <button key={p.id} onClick={() => setPosition(p.id as any)} className={`py-1.5 rounded-lg text-xs border font-medium transition-colors ${position === p.id ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 bg-card border border-border hover:bg-card-hover text-text-primary" onClick={download}><Download className="w-4 h-4 mr-2" /> Save</Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary" onClick={() => setSrc(null)}>Clear</Button>
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center bg-surface border border-border rounded-xl border border-white/5 min-h-[300px] overflow-hidden p-4">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Favicon Generator — canvas downsampling to 16/32/48/64px
───────────────────────────────────────────────────────────────────────────── */
export function FaviconGenerator() {
  const [src, setSrc] = useState<string | null>(null)
  const [size, setSize] = useState(32)
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([])

  const generateFavicons = useCallback(() => {
    if (!src) return
    const img = new Image()
    img.onload = () => {
      const sizes = [16, 32, 48, 64, 128]
      const results = sizes.map(s => {
        const c = document.createElement('canvas')
        c.width = s; c.height = s
        const ctx = c.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, s, s)
        return { size: s, url: c.toDataURL('image/png') }
      })
      setPreviews(results)
    }
    img.src = src
  }, [src])

  useEffect(() => { generateFavicons() }, [generateFavicons])

  const download = (url: string, s: number) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `favicon-${s}x${s}.png`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      {!src ? (
        <FileDropZone accept="image/*,.svg,.tiff,.tif,.heic,.avif" onFiles={f => { const r = new FileReader(); r.onload = e => setSrc(e.target?.result as string); r.readAsDataURL(f[0]) }} label="Drop a square logo or icon" sub="Best results with 512×512 or larger PNG" />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">Generated Favicons</h3>
            <Button variant="outline" className="border-white/10 hover:bg-white/10 text-text-primary text-sm" onClick={() => setSrc(null)}>Change Image</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {previews.map(p => (
              <div key={p.size} className="flex flex-col items-center gap-3 bg-card border border-border border-white/5 rounded-xl p-4 hover:border-border transition-colors">
                <div className="w-20 h-20 flex items-center justify-center bg-card border border-border rounded-lg border border-white/10">
                  <img src={p.url} alt={`${p.size}px`} style={{ width: p.size, height: p.size, imageRendering: 'pixelated' }} />
                </div>
                <span className="text-xs text-text-muted font-mono">{p.size}×{p.size}</span>
                <Button className="w-full text-xs py-1.5 bg-card border border-border hover:bg-card-hover text-text-primary" onClick={() => download(p.url, p.size)}>
                  <Download className="w-3 h-3 mr-1" /> PNG
                </Button>
              </div>
            ))}
          </div>
          <div className="bg-surface border border-border border-white/5 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3 text-sm">How to use in HTML</h4>
            <pre className="text-success font-mono text-xs overflow-auto whitespace-pre-wrap leading-relaxed">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="128x128" href="/favicon-128x128.png">`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. Placeholder Image Generator — canvas-based with text overlay
───────────────────────────────────────────────────────────────────────────── */
export function ImagePlaceholder() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [bg, setBg] = useState('#1e293b')
  const [textColor, setTextColor] = useState('#94a3b8')
  const [label, setLabel] = useState('')
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const presets = [
    { w: 1920, h: 1080, label: 'Full HD' }, { w: 1280, h: 720, label: 'HD' },
    { w: 800, h: 600, label: 'Standard' }, { w: 1200, h: 630, label: 'OG Image' },
    { w: 400, h: 400, label: 'Avatar' }, { w: 728, h: 90, label: 'Banner' },
  ]

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = Math.min(1, 600 / width, 400 / height)
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid pattern
    ctx.strokeStyle = textColor + '18'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 40 * scale) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke() }
    for (let y = 0; y < canvas.height; y += 40 * scale) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke() }

    // Cross lines
    ctx.strokeStyle = textColor + '30'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(canvas.width, canvas.height); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(canvas.width, 0); ctx.lineTo(0, canvas.height); ctx.stroke()

    // Size label
    const display = label || `${width} × ${height}`
    const fs = Math.max(12, Math.min(40, canvas.width / 10)) * scale
    ctx.fillStyle = textColor
    ctx.font = `bold ${fs}px Inter, Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(display, canvas.width / 2, canvas.height / 2)
  }, [width, height, bg, textColor, label])

  useEffect(() => { draw() }, [draw])

  const download = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = textColor + '18'; ctx.lineWidth = 1
    for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
    for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }
    ctx.strokeStyle = textColor + '30'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(width, height); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(width, 0); ctx.lineTo(0, height); ctx.stroke()
    ctx.fillStyle = textColor; ctx.font = `bold 48px Inter, Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(label || `${width} × ${height}`, width / 2, height / 2)
    const a = document.createElement('a')
    a.href = canvas.toDataURL(format); a.download = `placeholder-${width}x${height}.${format.split('/')[1]}`; a.click()
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-shrink-0 w-full md:w-72 space-y-4 bg-surface border border-border border-white/5 rounded-xl p-5">
        <h3 className="font-semibold text-text-primary">Placeholder Settings</h3>
        <div>
          <label className="text-sm text-text-primary block mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-1">
            {presets.map(p => (
              <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h) }} className="py-1.5 px-2 rounded-lg text-xs border font-medium transition-colors bg-card border border-border border-white/10 text-text-muted hover:text-text-primary hover:border-white/20">
                {p.label}<br /><span className="text-text-muted">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-text-muted block mb-1">Width (px)</label>
            <input type="number" value={width} onChange={e => setWidth(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm" />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">Height (px)</label>
            <input type="number" value={height} onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="text-xs text-text-muted block mb-1">Background</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 bg-transparent" /></div>
          <div><label className="text-xs text-text-muted block mb-1">Text Color</label><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 bg-transparent" /></div>
        </div>
        <div>
          <label className="text-sm text-text-primary block mb-1">Custom Label</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={`${width} × ${height}`} className="w-full bg-card border border-border border-white/10 rounded-lg px-3 py-2 text-text-primary text-sm" />
        </div>
        <div>
          <label className="text-sm text-text-primary block mb-2">Format</label>
          <div className="grid grid-cols-3 gap-1">
            {(['image/png', 'image/jpeg', 'image/webp'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)} className={`py-1.5 rounded-lg text-xs border font-medium transition-colors ${format === f ? 'bg-card border border-border border-border text-text-primary' : 'bg-card border border-border border-white/10 text-text-muted hover:text-text-primary'}`}>
                {f.split('/')[1].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <Button className="w-full bg-card border border-border hover:bg-card-hover text-text-primary" onClick={download}>
          <Download className="w-4 h-4 mr-2" /> Download {width}×{height}
        </Button>
      </div>
      <div className="flex-grow flex items-center justify-center bg-surface border border-border rounded-xl border border-white/5 min-h-[300px] overflow-hidden p-4">
        <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl border border-white/10" />
      </div>
    </div>
  )
}
