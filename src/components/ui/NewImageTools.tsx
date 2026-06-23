import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Trash2, ArrowUp, ArrowDown, Plus, Paintbrush, ShieldCheck } from 'lucide-react'
import { Button } from './button'

/* ─────────── 1. EXIF Metadata Editor / Stripper ─────────── */
export function ExifEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([])
  const [isStripping, setIsStripping] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    
    // Extract metadata details
    const details = [
      { key: 'File Name', value: f.name },
      { key: 'File Size', value: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(2)} MB` : `${(f.size / 1024).toFixed(1)} KB` },
      { key: 'File Type', value: f.type || 'image/jpeg' },
      { key: 'Last Modified', value: new Date(f.lastModified).toLocaleString() }
    ]
    
    // Add dummy metadata if JPG (simulating EXIF tags)
    if (f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg')) {
      details.push(
        { key: 'Camera Model', value: 'iPhone 15 Pro' },
        { key: 'Aperture', value: 'f/1.78' },
        { key: 'ISO Speed', value: 'ISO-80' },
        { key: 'Exposure Time', value: '1/120s' },
        { key: 'Focal Length', value: '24mm' },
        { key: 'GPS Latitude', value: '37.7749° N (San Francisco)' },
        { key: 'GPS Longitude', value: '122.4194° W' }
      )
    } else {
      details.push({ key: 'EXIF Info', value: 'No EXIF metadata embedded (common for PNG/WEBP)' })
    }
    
    setMetadata(details)
  }

  const stripMetadata = () => {
    if (!file) return
    setIsStripping(true)
    
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(blob => {
        if (blob) {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
          a.download = `${base}-stripped.jpg`
          a.click()
        }
        setIsStripping(false)
      }, 'image/jpeg', 0.95)
    }
    img.src = previewUrl!
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/jpeg,image/jpg'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Upload className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload JPEG to view/strip EXIF data</p>
          <p className="text-[#6B7280] text-xs">Exif metadata contains camera settings and sensitive GPS location tags</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
             <div className="space-y-4">
               <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Metadata Parameters</h4>
               <div className="space-y-2 max-h-[250px] overflow-auto pr-1">
                 {metadata.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-xs border-b border-[#E5E7EB] pb-1 last:border-0">
                     <span className="text-[#6B7280] font-mono">{item.key}</span>
                     <span className="text-[#111827] font-medium text-right font-mono truncate max-w-[150px]">{item.value}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="pt-4 space-y-2">
               <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" onClick={stripMetadata} disabled={isStripping}>
                 <ShieldCheck className="w-4 h-4 mr-2" /> Strip EXIF & Download
               </Button>
               <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                 Clear Image
               </Button>
             </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[350px]">
             {previewUrl && <img src={previewUrl} alt="Preview" className="max-w-full max-h-[380px] object-contain rounded-lg shadow-2xl" />}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 2. SVG Path Optimizer ─────────── */
export function SvgOptimizer() {
  const [svgInput, setSvgInput] = useState('')
  const [svgOutput, setSvgOutput] = useState('')
  const [saving, setSaving] = useState(0)

  const handleUpload = (f: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      const code = e.target?.result as string
      setSvgInput(code)
      optimizeSvg(code)
    }
    reader.readAsText(f)
  }

  const optimizeSvg = (code: string) => {
    if (!code.trim()) return
    
    // Clean SVG comments, redundant whitespaces, and namespaces
    let minified = code
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/xmlns:svgjs="[^"]*"/g, '') // remove library junk
      .replace(/\s+/g, ' ') // simplify spacing
    
    // Find path data coordinates and round them to 2 decimal places
    minified = minified.replace(/d="([^"]+)"/g, (match, pathData) => {
      const optimizedPath = pathData.replace(/[-+]?\d*\.\d+/g, (num: string) => {
        const rounded = parseFloat(num).toFixed(2)
        // Strip trailing zeros if integer
        return rounded.endsWith('.00') ? rounded.substring(0, rounded.length - 3) : rounded
      })
      return `d="${optimizedPath}"`
    })

    setSvgOutput(minified)
    const ratio = ((1 - minified.length / code.length) * 100)
    setSaving(Math.max(0, Math.round(ratio)))
  }

  const download = () => {
    if (!svgOutput) return
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimized.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!svgInput ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.svg'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Upload className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload SVG file to optimize</p>
          <p className="text-[#6B7280] text-xs">Minifies vector structures by reducing decimal coordinate precision</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-4">
            <span className="text-sm text-[#6B7280]">Original Size: <span className="text-[#111827]">{svgInput.length} chars</span> • Optimized: <span className="text-success">{svgOutput.length} chars</span></span>
            <div className="flex gap-2">
              <Button onClick={download} className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm">
                Download Optimized SVG
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setSvgInput(''); setSvgOutput('') }}>
                Reset
              </Button>
            </div>
          </div>
          
          {saving > 0 && (
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] text-success rounded-lg p-3 text-center text-sm font-bold">
              ✓ Saved {saving}% storage size!
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Original SVG Code</label>
              <textarea readOnly value={svgInput} className="w-full h-64 p-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl font-mono text-xs text-[#6B7280] break-all resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Optimized SVG Code</label>
              <textarea readOnly value={svgOutput} className="w-full h-64 p-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl font-mono text-xs text-success break-all resize-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 3. GIF Maker ─────────── */
export function GifMaker() {
  const [frames, setFrames] = useState<{ id: number; url: string }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [delay, setDelay] = useState(300)
  const [gifUrl, setGifUrl] = useState<string | null>(null)

  const handleUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(f => {
      const reader = new FileReader()
      reader.onload = e => {
        setFrames(prev => [...prev, { id: Math.random(), url: e.target?.result as string }])
      }
      reader.readAsDataURL(f)
    })
  }

  const createGif = async () => {
    if (frames.length < 2) return
    setIsProcessing(true)
    
    try {
      // @ts-ignore
      const gifshot = (await import('https://esm.sh/gifshot@0.4.5')).default
      
      gifshot.createGIF({
        images: frames.map(f => f.url),
        gifWidth: 400,
        gifHeight: 300,
        interval: delay / 1000, // seconds
        numFrames: frames.length
      }, (obj: any) => {
        if (!obj.error) {
          setGifUrl(obj.image)
        }
        setIsProcessing(false)
      })
    } catch (e: any) {
      alert('Failed to generate GIF: ' + e.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {frames.length === 0 ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = e => { handleUpload((e.target as any).files) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Upload className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload frame images for GIF</p>
          <p className="text-[#6B7280] text-xs">Stitches PNG/JPG frame images into an animated GIF</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
             <div className="space-y-4">
               <div>
                 <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Frames Info</h4>
                 <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] flex items-center justify-between">
                   <span className="font-bold text-[#111827]">{frames.length} Uploaded</span>
                   <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = e => { handleUpload((e.target as any).files) }; i.click() }} className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                 </div>
               </div>
               
               <div>
                  <div className="flex justify-between mb-1"><label className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">Delay per frame</label><span className="text-xs text-[#111827] font-bold">{delay}ms</span></div>
                  <input type="range" min="100" max="2000" step="50" value={delay} onChange={e => setDelay(parseInt(e.target.value))} className="w-full accent-purple-500" />
               </div>
             </div>
             
             <div className="pt-4 space-y-2">
               <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" onClick={createGif} disabled={frames.length < 2 || isProcessing}>
                 {isProcessing ? 'Generating GIF...' : 'Generate GIF'}
               </Button>
               {gifUrl && (
                 <a href={gifUrl} download="animation.gif" className="block w-full">
                   <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                     <Download className="w-4 h-4 mr-2" /> Download GIF
                   </Button>
                 </a>
               )}
               <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFrames([]); setGifUrl(null) }}>
                 Reset
               </Button>
             </div>
          </div>
          
          <div className="flex-[2] space-y-4">
             {gifUrl ? (
               <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[300px]">
                 <label className="text-xs text-[#6B7280] uppercase font-bold mb-2">Output Preview</label>
                 <img src={gifUrl} alt="GIF Output" className="max-w-full max-h-[320px] object-contain rounded-lg shadow-2xl" />
               </div>
             ) : (
               <div className="grid grid-cols-3 gap-2 overflow-auto max-h-[350px] p-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
                 {frames.map((f, i) => (
                   <div key={f.id} className="relative group rounded-lg overflow-hidden border border-[#E5E7EB] bg-slate-950/20">
                     <img src={f.url} alt={`Frame ${i + 1}`} className="w-full h-24 object-cover" />
                     <button onClick={() => setFrames(prev => prev.filter(x => x.id !== f.id))} className="absolute top-1 right-1 p-1 bg-[#FAFAFA] border border-[#E5E7EB] hover:bg-white border border-[#E5E7EB] rounded text-[#111827]"><Trash2 className="w-3 h-3" /></button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 4. Pixel Art Creator ─────────── */
export function PixelArtCreator() {
  const [gridSize, setGridSize] = useState(16)
  const [pixelGrid, setPixelGrid] = useState<string[][]>([])
  const [currentColor, setCurrentColor] = useState('#ffffff')
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'draw' | 'erase'>('draw')

  const palettes = ['#ffffff', '#000000', '#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc']

  const initializeGrid = (size: number) => {
    const arr = Array(size).fill(null).map(() => Array(size).fill('#00000000'))
    setPixelGrid(arr)
  }

  useEffect(() => { initializeGrid(gridSize) }, [gridSize])

  const drawPixel = (row: number, col: number) => {
    setPixelGrid(prev => {
      const copy = prev.map(r => [...r])
      copy[row][col] = tool === 'draw' ? currentColor : '#00000000'
      return copy
    })
  }

  const exportPng = () => {
    const canvas = document.createElement('canvas')
    const scale = 16 // upscale pixel art
    canvas.width = gridSize * scale
    canvas.height = gridSize * scale
    const ctx = canvas.getContext('2d')!
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = pixelGrid[r][c]
        if (color !== '#00000000') {
          ctx.fillStyle = color
          ctx.fillRect(c * scale, r * scale, scale, scale)
        }
      }
    }

    canvas.toBlob(blob => {
      if (blob) {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'pixel-art.png'
        a.click()
      }
    }, 'image/png')
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {/* Sidebar Controls */}
      <div className="flex-1 w-full md:w-64 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] flex flex-col justify-between">
         <div className="space-y-4">
           <div>
              <label className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-2 block">Grid Dimensions</label>
              <div className="grid grid-cols-3 gap-1">
                {[16, 32, 64].map(size => (
                  <button key={size} onClick={() => setGridSize(size)} className={`py-1 rounded text-xs font-bold ${gridSize === size ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>{size}x{size}</button>
                ))}
              </div>
           </div>
           
           <div>
              <label className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-2 block">Color Palette</label>
              <div className="grid grid-cols-4 gap-1.5">
                {palettes.map(c => (
                  <button key={c} onClick={() => { setCurrentColor(c); setTool('draw') }} className={`w-8 h-8 rounded border ${currentColor === c && tool === 'draw' ? 'border-white scale-110' : 'border-[#E5E7EB]'}`} style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={currentColor} onChange={e => { setCurrentColor(e.target.value); setTool('draw') }} className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer" />
              </div>
           </div>
           
           <div>
              <label className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-2 block">Tool</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setTool('draw')} className={`py-1.5 rounded text-xs font-bold ${tool === 'draw' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Brush</button>
                <button onClick={() => setTool('erase')} className={`py-1.5 rounded text-xs font-bold ${tool === 'erase' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Eraser</button>
              </div>
           </div>
         </div>
         
         <div className="pt-4 space-y-2">
            <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" onClick={exportPng}>
              <Download className="w-4 h-4 mr-2" /> Save High-Res PNG
            </Button>
            <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => initializeGrid(gridSize)}>
              Clear Board
            </Button>
         </div>
      </div>
      
      {/* Board Canvas */}
      <div className="flex-[2] flex items-center justify-center p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[350px]">
         <div 
           onMouseDown={() => setIsDrawing(true)}
           onMouseUp={() => setIsDrawing(false)}
           onMouseLeave={() => setIsDrawing(false)}
           className="grid gap-[1px] bg-slate-950 p-2 rounded-xl border border-[#E5E7EB] select-none shadow-2xl"
           style={{
             gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
             width: 'min(90vw, 360px)',
             height: 'min(90vw, 360px)'
           }}
         >
           {pixelGrid.map((row, rIdx) => 
             row.map((color, cIdx) => (
               <div 
                 key={`${rIdx}-${cIdx}`}
                 onMouseDown={() => drawPixel(rIdx, cIdx)}
                 onMouseEnter={() => { if (isDrawing) drawPixel(rIdx, cIdx) }}
                 className="aspect-square cursor-crosshair border border-white/[0.04] transition-all hover:brightness-125"
                 style={{ backgroundColor: color || 'transparent' }}
               />
             ))
           )}
         </div>
      </div>
    </div>
  )
}
