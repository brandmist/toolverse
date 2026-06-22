import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Palette, Image as ImageIcon, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from './button'

export function ChangePhotoBackground() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removedBgUrl, setRemovedBgUrl] = useState<string | null>(null)
  const [bgType, setBgType] = useState<'color' | 'image'>('color')
  const [bgColor, setBgColor] = useState('#6366f1')
  const [bgFileUrl, setBgFileUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setRemovedBgUrl(null)
    setBgFileUrl(null)
  }

  const removeBackground = async () => {
    if (!file) return
    setProcessing(true)
    setStatusText('Downloading AI segments (WASM model)...')
    try {
      // @ts-ignore
      const { removeBackground: imglyRemoveBackground } = await import('@imgly/background-removal')
      setStatusText('Processing background isolation...')
      const blob = await imglyRemoveBackground(file, {
        progress: (key: string, current: number, total: number) => {
          setStatusText(`Analyzing structures: ${Math.round((current / total) * 100)}%`)
        }
      })
      setRemovedBgUrl(URL.createObjectURL(blob))
    } catch (e: any) {
      alert('Failed to remove background: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  // Composites the foreground and background together onto canvas
  const drawComposite = () => {
    const canvas = canvasRef.current
    if (!canvas || !removedBgUrl) return
    const ctx = canvas.getContext('2d')!

    const imgFg = new Image()
    imgFg.onload = () => {
      canvas.width = imgFg.naturalWidth
      canvas.height = imgFg.naturalHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (bgType === 'color') {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(imgFg, 0, 0)
      } else if (bgType === 'image' && bgFileUrl) {
        const imgBg = new Image()
        imgBg.onload = () => {
          ctx.drawImage(imgBg, 0, 0, canvas.width, canvas.height)
          ctx.drawImage(imgFg, 0, 0)
        }
        imgBg.src = bgFileUrl
      } else {
        ctx.drawImage(imgFg, 0, 0)
      }
    }
    imgFg.src = removedBgUrl
  }

  useEffect(() => {
    if (removedBgUrl) drawComposite()
  }, [removedBgUrl, bgType, bgColor, bgFileUrl])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        const base = file?.name.substring(0, file.name.lastIndexOf('.')) || 'image'
        a.download = `${base}-bg-changed.png`
        a.click()
      }
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <ImageIcon className="w-12 h-12 text-text-primary mb-4" />
          <p className="text-text-primary font-medium mb-1">Click to upload photo to change background</p>
          <p className="text-text-muted text-xs">Isolates subjects locally in browser and applies custom background styles</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-surface border border-border p-4 rounded-xl border border-white/5 max-w-[320px] flex flex-col justify-between">
             <div className="space-y-4">
               {!removedBgUrl ? (
                 <div className="space-y-2">
                   <p className="text-xs text-text-muted">Step 1: Isolate subject from original background</p>
                   <Button onClick={removeBackground} className="w-full bg-card border border-border hover:bg-card-hover text-text-primary font-semibold text-sm">
                     <Sparkles className="w-4 h-4 mr-2" /> Isolate Subject (AI)
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center gap-2 text-success text-xs font-semibold">
                     <CheckCircle className="w-4 h-4" /> Subject isolated successfully!
                   </div>
                   
                   <div>
                     <label className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2 block">Background Type</label>
                     <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => setBgType('color')} className={`py-1.5 rounded-lg text-xs font-bold ${bgType === 'color' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Color</button>
                       <button onClick={() => setBgType('image')} className={`py-1.5 rounded-lg text-xs font-bold ${bgType === 'image' ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-muted'}`}>Image</button>
                     </div>
                   </div>
                   
                   {bgType === 'color' ? (
                     <div>
                       <label className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2 block">Fill Color</label>
                       <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
                     </div>
                   ) : (
                     <div>
                       <label className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2 block">Background Image</label>
                       <input 
                         type="file" 
                         accept="image/*,.svg,.tiff,.tif,.heic,.avif"
                         onChange={e => {
                           const f = e.target.files?.[0]
                           if (f) setBgFileUrl(URL.createObjectURL(f))
                         }}
                         className="w-full text-xs bg-card border border-border border-white/10 rounded-lg p-2 text-text-muted"
                       />
                     </div>
                   )}
                 </div>
               )}
             </div>
             
             <div className="pt-4 space-y-2">
               {removedBgUrl && (
                 <Button onClick={download} className="w-full bg-card border border-border hover:bg-card-hover text-text-primary font-semibold text-sm">
                   <Download className="w-4 h-4 mr-2" /> Download Photo
                 </Button>
               )}
               <Button variant="outline" className="w-full border-white/10 text-text-primary text-sm" onClick={() => { setFile(null); setPreviewUrl(null); setRemovedBgUrl(null) }}>
                 Reset
               </Button>
             </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-card border border-border rounded-xl border border-white/5 min-h-[350px] relative">
             {removedBgUrl ? (
               <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-lg shadow-2xl" />
             ) : (
               previewUrl && <img src={previewUrl} alt="Preview" className="max-w-full max-h-[380px] object-contain rounded-lg opacity-60" />
             )}
             
             {processing && (
               <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
                 <RefreshCw className="w-8 h-8 text-text-primary animate-spin mb-3" />
                 <p className="text-text-primary font-medium text-sm">{statusText}</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
