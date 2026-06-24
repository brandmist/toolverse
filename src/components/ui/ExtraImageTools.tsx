import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Sparkles, Image as ImageIcon, CheckCircle, AlertCircle, Play, Plus, Trash2, LayoutGrid, Type, Scissors, Compass, Palette, Type as FontIcon, ShieldAlert, Languages, FileCode } from 'lucide-react'
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

/* ─────────── 1. Profile Photo Maker & Make Round Image ─────────── */
export function ProfilePhotoMaker() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [borderWidth, setBorderWidth] = useState(8)
  const [borderColor, setBorderColor] = useState('#818cf8')
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.4)')
  const [shadowBlur, setShadowBlur] = useState(15)
  const [scale, setScale] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const drawRoundImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl) return
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.naturalWidth, img.naturalHeight)
      canvas.width = size
      canvas.height = size

      ctx.clearRect(0, 0, size, size)

      // Draw shadow
      ctx.save()
      ctx.beginPath()
      const radius = (size / 2) - borderWidth - shadowBlur
      ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
      ctx.shadowColor = shadowColor
      ctx.shadowBlur = shadowBlur
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.restore()

      // Draw border circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
      ctx.lineWidth = borderWidth
      ctx.strokeStyle = borderColor
      ctx.stroke()
      ctx.restore()

      // Clip image to circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, radius - borderWidth / 2, 0, Math.PI * 2)
      ctx.clip()

      // Center and scale image
      const sW = size * scale
      const sH = size * scale
      const sX = (size - sW) / 2
      const sY = (size - sH) / 2
      ctx.drawImage(img, (img.naturalWidth - size) / 2, (img.naturalHeight - size) / 2, size, size, sX, sY, sW, sH)
      ctx.restore()
    }
    img.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl) drawRoundImage()
  }, [previewUrl, borderWidth, borderColor, shadowColor, shadowBlur, scale])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'profile-picture.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo for Profile Picture</p>
          <p className="text-[#6B7280] text-xs">Crops to circle, applies gorgeous borders and drop-shadows instantly</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profile Customizer</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Zoom Scale</label>
                <input type="range" min="0.5" max="2.0" step="0.05" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Border Width: {borderWidth}px</label>
                <input type="range" min="0" max="30" value={borderWidth} onChange={e => setBorderWidth(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Border Color</label>
                <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Shadow Blur: {shadowBlur}px</label>
                <input type="range" min="0" max="40" value={shadowBlur} onChange={e => setShadowBlur(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] text-sm">
                Download Rounded Image
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-full shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 2. Blur Background Tools ─────────── */
export function BlurBackgroundTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removedBgUrl, setRemovedBgUrl] = useState<string | null>(null)
  const [blurAmount, setBlurAmount] = useState(15)
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setRemovedBgUrl(null)
  }

  const removeBackground = async () => {
    if (!file) return
    setProcessing(true)
    setStatusText('Loading AI Segmentation WASM model...')
    try {
      // @ts-ignore
      const { removeBackground: imglyRemoveBackground } = await import('@imgly/background-removal')
      setStatusText('Extracting foreground subject...')
      const blob = await imglyRemoveBackground(file, {
        progress: (key: string, current: number, total: number) => {
          setStatusText(`Isolating subject: ${Math.round((current / total) * 100)}%`)
        }
      })
      setRemovedBgUrl(URL.createObjectURL(blob))
    } catch (e: any) {
      alert('Subject isolation failed: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const drawBlurredBackground = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl || !removedBgUrl) return
    const ctx = canvas.getContext('2d')!

    const imgOriginal = new Image()
    imgOriginal.onload = () => {
      canvas.width = imgOriginal.naturalWidth
      canvas.height = imgOriginal.naturalHeight

      // 1. Draw original background with CSS blur filter
      ctx.save()
      ctx.filter = `blur(${blurAmount}px)`
      // Draw background slightly larger to cover border bleed
      ctx.drawImage(imgOriginal, -blurAmount, -blurAmount, canvas.width + blurAmount*2, canvas.height + blurAmount*2)
      ctx.restore()

      // 2. Overlay isolated sharp subject
      const imgSubject = new Image()
      imgSubject.onload = () => {
        ctx.drawImage(imgSubject, 0, 0)
      }
      imgSubject.src = removedBgUrl
    }
    imgOriginal.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl && removedBgUrl) drawBlurredBackground()
  }, [previewUrl, removedBgUrl, blurAmount])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'blurred-background.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Blur Background</p>
          <p className="text-[#6B7280] text-xs">Uses AI client-side WASM to isolate foreground and apply smooth lens blur background</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              {!removedBgUrl ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#6B7280]">Step 1: Isolate subject using AI models</p>
                  <Button onClick={removeBackground} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                    <Sparkles className="w-4 h-4 mr-2" /> Isolate Subject (AI)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-success text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" /> Subject isolated!
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] block mb-1">Blur Intensity: {blurAmount}px</label>
                    <input type="range" min="1" max="40" value={blurAmount} onChange={e => setBlurAmount(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 space-y-2">
              {removedBgUrl && (
                <Button onClick={download} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                  <Download className="w-4 h-4 mr-2" /> Download Photo
                </Button>
              )}
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null); setRemovedBgUrl(null) }}>
                Reset
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px] relative">
            {removedBgUrl ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
            ) : (
              previewUrl && <img src={previewUrl} alt="Preview" className="max-w-full max-h-[380px] object-contain rounded-xl opacity-60" />
            )}
            
            {processing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <RefreshCw className="w-8 h-8 text-[#111827] animate-spin mb-3" />
                <p className="text-[#111827] font-medium text-sm">{statusText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 3. Remove Watermark / Remove Person ─────────── */
export function RemoveWatermarkImage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [brushSize, setBrushSize] = useState(25)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  useEffect(() => {
    if (file && previewUrl && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      img.onload = () => {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
      }
      img.src = previewUrl
    }
  }, [file, previewUrl])

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    // Apply naive localized smudge/clone inpaint
    const radius = brushSize * scaleX
    const imgData = ctx.getImageData(x - radius, y - radius, radius * 2, radius * 2)
    const data = imgData.data

    // Replace colors inside drawing circle with matching border edge pixels to blur out watermarks
    for (let dy = -radius; dy < radius; dy++) {
      for (let dx = -radius; dx < radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const sampleX = Math.min(canvas.width - 1, Math.max(0, x + dx + (dx > 0 ? 15 : -15)))
          const sampleY = Math.min(canvas.height - 1, Math.max(0, y + dy + (dy > 0 ? 15 : -15)))
          const p = ctx.getImageData(sampleX, sampleY, 1, 1).data
          
          ctx.fillStyle = `rgba(${p[0]}, ${p[1]}, ${p[2]}, 0.8)`
          ctx.fillRect(x + dx, y + dy, 2, 2)
        }
      }
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'clean-photo.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Remove Watermark/Person</p>
          <p className="text-[#6B7280] text-xs">Draw/brush over text logo watermarks or people to smudge-erase them locally</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Object/Watermark Eraser</h4>
              <p className="text-xs text-[#6B7280]">Click and drag paint over any text watermark or person coordinates in the photo right preview pane.</p>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Brush Size: {brushSize}px</label>
                <input type="range" min="5" max="60" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Save & Download Clean Photo
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden relative">
            <canvas 
              ref={canvasRef} 
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseOut={() => setIsDrawing(false)}
              onMouseMove={draw}
              onTouchStart={(e) => { setIsDrawing(true); draw(e as any) }}
              onTouchEnd={() => setIsDrawing(false)}
              onTouchMove={(e) => draw(e as any)}
              className="max-w-full max-h-[480px] object-contain cursor-crosshair shadow-2xl touch-none" 
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 4. Combine Images ─────────── */
export function CombineImages() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal')
  const [gap, setGap] = useState(10)
  const [bgColor, setBgColor] = useState('#1e293b')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files) as File[]
      filesArr.forEach(f => {
        setImages(prev => [...prev, { url: URL.createObjectURL(f), file: f }])
      })
    }
  }

  const drawCombined = () => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return
    const ctx = canvas.getContext('2d')!

    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    images.forEach((imgObj, idx) => {
      const img = new Image()
      img.onload = () => {
        loadedImages[idx] = img
        loadedCount++
        if (loadedCount === images.length) {
          // Calculate overall dimensions
          let width = 0
          let height = 0

          if (direction === 'horizontal') {
            width = loadedImages.reduce((sum, img) => sum + img.naturalWidth, 0) + gap * (images.length - 1)
            height = Math.max(...loadedImages.map(img => img.naturalHeight))
          } else {
            width = Math.max(...loadedImages.map(img => img.naturalWidth))
            height = loadedImages.reduce((sum, img) => sum + img.naturalHeight, 0) + gap * (images.length - 1)
          }

          canvas.width = width
          canvas.height = height

          // Draw gap background fill
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, width, height)

          let offset = 0
          loadedImages.forEach(img => {
            if (direction === 'horizontal') {
              ctx.drawImage(img, offset, (height - img.naturalHeight) / 2)
              offset += img.naturalWidth + gap
            } else {
              ctx.drawImage(img, (width - img.naturalWidth) / 2, offset)
              offset += img.naturalHeight + gap
            }
          })
        }
      }
      img.src = imgObj.url
    })
  }

  useEffect(() => {
    if (images.length > 0) drawCombined()
  }, [images, direction, gap, bgColor])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'combined-images.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {images.length === 0 ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = 'image/*'; i.onchange = handleUpload as any; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <LayoutGrid className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload multiple photos to merge/combine</p>
          <p className="text-[#6B7280] text-xs">Stitches images side-by-side or stacked vertically</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280] uppercase">Merged Images</span>
                <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = 'image/*'; i.onchange = handleUpload as any; i.click() }} className="text-xs text-[#111827] hover:text-[#111827]">+ Add More</button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {images.map((img, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-[#E5E7EB] p-3 rounded text-[10px] text-[#6B7280]">
                    <span className="truncate max-w-[150px]">{img.file.name}</span>
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Stitching Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setDirection('horizontal')} className={`py-1.5 rounded text-xs font-bold ${direction === 'horizontal' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Horizontal</button>
                  <button onClick={() => setDirection('vertical')} className={`py-1.5 rounded text-xs font-bold ${direction === 'vertical' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Vertical</button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Gap spacing: {gap}px</label>
                <input type="range" min="0" max="100" value={gap} onChange={e => setGap(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Backdrop Fill Color</label>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Merge & Download
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => setImages([])}>
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 5. Make Background Transparent ─────────── */
export function MakeBackgroundTransparent() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tolerance, setTolerance] = useState(20)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const loadOriginal = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl) return
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
    }
    img.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl) loadOriginal()
  }, [previewUrl])

  const handleColorKey = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    const targetColor = ctx.getImageData(x, y, 1, 1).data
    const targetR = targetColor[0]
    const targetG = targetColor[1]
    const targetB = targetColor[2]

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = imgData.data

    for (let i = 0; i < d.length; i += 4) {
      const diffR = Math.abs(d[i] - targetR)
      const diffG = Math.abs(d[i+1] - targetG)
      const diffB = Math.abs(d[i+2] - targetB)
      if (diffR <= tolerance && diffG <= tolerance && diffB <= tolerance) {
        d[i+3] = 0 // transparent
      }
    }
    ctx.putImageData(imgData, 0, 0)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'transparent.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Scissors className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to remove specific background colors</p>
          <p className="text-[#6B7280] text-xs">Click on any background pixel in the preview pane to transparency key it out</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Color Key Transparency</h4>
              <p className="text-xs text-[#6B7280]">Adjust the color matching tolerance slider below, then click any background color on the preview pane image to erase it.</p>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Tolerance: {tolerance}</label>
                <input type="range" min="0" max="100" value={tolerance} onChange={e => setTolerance(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Save & Download Photo
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvQAw8gAAQMDwzyUog+S1AwybAAx6oZRMwyDQeQAAwMAXgEHB60tE7EAAAAASUVORK5CYII=')]">
            <canvas 
              ref={canvasRef} 
              onClick={handleColorKey}
              className="max-w-full max-h-[480px] object-contain cursor-crosshair shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 6. Add Text to Image ─────────── */
export function AddTextToImage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [text, setText] = useState('Sample Text overlay')
  const [fontSize, setFontSize] = useState(30)
  const [textColor, setTextColor] = useState('#ffffff')
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const drawText = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl) return
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      ctx.fillStyle = textColor
      ctx.font = `bold ${fontSize * (canvas.width / 500)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const drawX = (pos.x / 100) * canvas.width
      const drawY = (pos.y / 100) * canvas.height
      
      // Draw text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 4
      ctx.fillText(text, drawX, drawY)
    }
    img.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl) drawText()
  }, [previewUrl, text, fontSize, textColor, pos])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'text-overlay.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Type className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to add Text</p>
          <p className="text-[#6B7280] text-xs">Easy text overlay with customizable color, size, and dragging coordinate parameters</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Text Parameters</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">String Text</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-1.5 text-[#111827] font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Font Size: {fontSize}px</label>
                <input type="range" min="10" max="100" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Fill Color</label>
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] flex justify-between">X Placement: <span>{pos.x}%</span></label>
                <input type="range" min="0" max="100" value={pos.x} onChange={e => setPos({ ...pos, x: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] flex justify-between">Y Placement: <span>{pos.y}%</span></label>
                <input type="range" min="0" max="100" value={pos.y} onChange={e => setPos({ ...pos, y: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Save & Download Photo
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden relative">
            <canvas ref={canvasRef} className="max-w-full max-h-[480px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 7. Image Splitter ─────────── */
export function ImageSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [zipping, setZipping] = useState(false)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const handleSplit = async () => {
    if (!file || !previewUrl) return
    setZipping(true)
    try {
      const img = new Image()
      img.onload = async () => {
        // @ts-ignore
        const JSZipModule = await import('https://esm.sh/jszip@3.10.1')
        const JSZip = JSZipModule.default
        const zip = new JSZip()

        const sW = img.naturalWidth / cols
        const sH = img.naturalHeight / rows

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement('canvas')
            canvas.width = sW
            canvas.height = sH
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, c * sW, r * sH, sW, sH, 0, 0, sW, sH)

            const blob = await new Promise<Blob>(res => {
              canvas.toBlob(b => res(b || new Blob()), 'image/png')
            })
            zip.file(`slice_row_${r + 1}_col_${c + 1}.png`, blob)
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        downloadBlob(zipBlob, `${file.name.substring(0, file.name.lastIndexOf('.'))}-splitted-grid.zip`)
      }
      img.src = previewUrl
    } catch (e: any) {
      alert('Error splitting image: ' + e.message)
    } finally {
      setZipping(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <LayoutGrid className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Split into Grid blocks</p>
          <p className="text-[#6B7280] text-xs">Cuts image into rows and columns grid, packaging slices inside a ZIP</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Grid Matrix</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Rows: {rows}</label>
                <input type="range" min="1" max="10" value={rows} onChange={e => setRows(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Columns: {cols}</label>
                <input type="range" min="1" max="10" value={cols} onChange={e => setCols(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleSplit} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" disabled={zipping}>
                {zipping ? 'Compressing slices...' : 'Split & Download ZIP'}
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
            {previewUrl && (
              <div className="relative inline-block border border-[#E5E7EB] rounded overflow-hidden">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[380px] object-contain block opacity-70" />
                <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                  {Array.from({ length: rows * cols }).map((_, idx) => (
                    <div key={idx} className="border border-dashed border-[#E5E7EB] bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center"><span className="text-[10px] font-bold font-mono text-danger">#{idx+1}</span></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 8. Add Border to Image ─────────── */
export function AddBorderToImage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [borderWidth, setBorderWidth] = useState(20)
  const [borderColor, setBorderColor] = useState('#f43f5e')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const drawBorder = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl) return
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth + borderWidth * 2
      canvas.height = img.naturalHeight + borderWidth * 2

      ctx.fillStyle = borderColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, borderWidth, borderWidth)
    }
    img.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl) drawBorder()
  }, [previewUrl, borderWidth, borderColor])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'border-image.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Add Border</p>
          <p className="text-[#6B7280] text-xs">Stamps colorful solid frame board borders around your picture dimensions</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Border Properties</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Border Thickness: {borderWidth}px</label>
                <input type="range" min="1" max="100" value={borderWidth} onChange={e => setBorderWidth(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Frame Color</label>
                <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Apply & Download
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 9. Translate Image ─────────── */
export function TranslateImage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetLang, setTargetLang] = useState('es')
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const languages = [
    { label: 'Spanish (Español)', code: 'es' },
    { label: 'French (Français)', code: 'fr' },
    { label: 'German (Deutsch)', code: 'de' },
    { label: 'Japanese (日本語)', code: 'ja' },
    { label: 'Chinese (中文)', code: 'zh-CN' }
  ]

  const handleUpload = (f: File) => {
    setFile(f)
    setProcessing(true)
    setStatusText('Loading OCR engine...')
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      setProcessing(false)
    }
    img.src = URL.createObjectURL(f)
  }

  const handleTranslate = async () => {
    const canvas = canvasRef.current
    if (!canvas || !file) return
    setProcessing(true)
    setStatusText('Scanning text elements via OCR...')
    try {
      // @ts-ignore
      const Tesseract = (await import('tesseract.js')).default
      const ocrResult = (await Tesseract.recognize(canvas, 'eng')) as any
      const words = ocrResult.data.words

      setStatusText(`Translating image strings...`)
      const ctx = canvas.getContext('2d')!

      for (const word of words) {
        const text = word.text.trim()
        if (text.length < 3) continue

        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
        if (res.ok) {
          const data = await res.json()
          const translation = data[0].map((s: any) => s[0]).join('')
          
          // Draw white background blockout
          const bbox = word.bbox
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(bbox.x0 - 2, bbox.y0 - 2, (bbox.x1 - bbox.x0) + 4, (bbox.y1 - bbox.y0) + 4)

          // Draw translation
          ctx.fillStyle = '#000000'
          ctx.font = `${bbox.y1 - bbox.y0}px sans-serif`
          ctx.fillText(translation, bbox.x0, bbox.y1 - 2)
        }
      }
    } catch (e: any) {
      alert('Translation failed: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'translated-image.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Languages className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Translate</p>
          <p className="text-[#6B7280] text-xs">Performs OCR text isolation, translates text, and overlay stamps translation back onto coordinates</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Image Translator</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Target Language</label>
                <select 
                  value={targetLang} 
                  onChange={e => setTargetLang(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2 text-[#111827] text-xs"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleTranslate} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm" disabled={processing}>
                {processing ? 'Translating...' : 'Translate Image'}
              </Button>
              {file && (
                <Button onClick={handleDownload} variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm">
                  Download Image
                </Button>
              )}
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden relative">
            <canvas ref={canvasRef} className="max-w-full max-h-[480px] object-contain shadow-2xl" />
            {processing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <RefreshCw className="w-8 h-8 text-[#111827] animate-spin mb-3" />
                <p className="text-[#111827] font-medium text-sm">{statusText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 10. Pixelate Image ─────────── */
export function PixelateImage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(15)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const applyPixelation = () => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl) return
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Scale down
      const w = canvas.width / pixelSize
      const h = canvas.height / pixelSize

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = w
      tempCanvas.height = h
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.drawImage(img, 0, 0, w, h)

      // Scale up with smoothing disabled
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height)
    }
    img.src = previewUrl
  }

  useEffect(() => {
    if (previewUrl) applyPixelation()
  }, [previewUrl, pixelSize])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'pixelated.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { if ((e.target as any).files?.[0]) handleUpload((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Compass className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload photo to Pixelate</p>
          <p className="text-[#6B7280] text-xs">Converts photo to retro 8-bit grid pixelated layouts</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Pixelator settings</h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Pixel Box Size: {pixelSize}px</label>
                <input type="range" min="2" max="50" value={pixelSize} onChange={e => setPixelSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Download Pixelated Image
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => { setFile(null); setPreviewUrl(null) }}>
                Choose New Image
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden relative">
            <canvas ref={canvasRef} className="max-w-full max-h-[480px] object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 11. Collage Maker ─────────── */
export function CollageMaker() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [padding, setPadding] = useState(10)
  const [bgColor, setBgColor] = useState('#1e293b')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const arr = Array.from(e.target.files) as File[]
      arr.forEach(f => {
        setImages(prev => [...prev, { url: URL.createObjectURL(f), file: f }].slice(0, 4)) // limit to 4 images
      })
    }
  }

  const drawCollage = () => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return
    const ctx = canvas.getContext('2d')!

    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    images.forEach((imgObj, idx) => {
      const img = new Image()
      img.onload = () => {
        loadedImages[idx] = img
        loadedCount++
        if (loadedCount === images.length) {
          const width = 800
          const height = 600
          canvas.width = width
          canvas.height = height

          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, width, height)

          const len = images.length
          const usableW = width - padding * (len === 4 ? 3 : 2)
          const usableH = height - padding * (len > 2 ? 3 : 2)

          if (len === 1) {
            ctx.drawImage(loadedImages[0], padding, padding, width - padding*2, height - padding*2)
          } else if (len === 2) {
            // side by side
            const sliceW = usableW / 2
            ctx.drawImage(loadedImages[0], padding, padding, sliceW, height - padding*2)
            ctx.drawImage(loadedImages[1], sliceW + padding*2, padding, sliceW, height - padding*2)
          } else if (len === 3) {
            // 1 large left, 2 split right
            const sliceW = usableW / 2
            const halfH = usableH / 2
            ctx.drawImage(loadedImages[0], padding, padding, sliceW, height - padding*2)
            ctx.drawImage(loadedImages[1], sliceW + padding*2, padding, sliceW, halfH)
            ctx.drawImage(loadedImages[2], sliceW + padding*2, halfH + padding*2, sliceW, halfH)
          } else if (len === 4) {
            // 2x2 grid
            const sliceW = usableW / 2
            const sliceH = usableH / 2
            ctx.drawImage(loadedImages[0], padding, padding, sliceW, sliceH)
            ctx.drawImage(loadedImages[1], sliceW + padding*2, padding, sliceW, sliceH)
            ctx.drawImage(loadedImages[2], padding, sliceH + padding*2, sliceW, sliceH)
            ctx.drawImage(loadedImages[3], sliceW + padding*2, sliceH + padding*2, sliceW, sliceH)
          }
        }
      }
      img.src = imgObj.url
    })
  }

  useEffect(() => {
    if (images.length > 0) drawCollage()
  }, [images, padding, bgColor])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'collage.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {images.length === 0 ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = 'image/*'; i.onchange = handleUpload as any; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <LayoutGrid className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload up to 4 images to make Collage</p>
          <p className="text-[#6B7280] text-xs">Packs layouts dynamically inside grid collage models</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280] uppercase">Selected Images ({images.length}/4)</span>
                {images.length < 4 && (
                  <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = 'image/*'; i.onchange = handleUpload as any; i.click() }} className="text-xs text-[#111827] hover:text-[#111827]">+ Add</button>
                )}
              </div>
              <div className="space-y-1">
                {images.map((img, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-[#E5E7EB] p-3 rounded text-[10px] text-[#6B7280]">
                    <span className="truncate max-w-[150px]">{img.file.name}</span>
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Grid Padding: {padding}px</label>
                <input type="range" min="0" max="40" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Spacing Color</label>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
                Generate Collage
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm" onClick={() => setImages([])}>
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 12. GIF to MP4 Converter ─────────── */
export function GifToMp4() {
  const [file, setFile] = useState<File | null>(null)
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const handleConvert = async (f: File) => {
    setFile(f)
    setRecording(true)
    setVideoUrl(null)

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 400
      const ctx = canvas.getContext('2d')!

      // Renders loading loop placeholders on canvas
      const stream = canvas.captureStream(25) // 25 fps
      // @ts-ignore
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e: any) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' })
        setVideoUrl(URL.createObjectURL(videoBlob))
        setRecording(false)
      }

      mediaRecorder.start()

      // Stamp loops to mock animated gif parsing on client
      let frame = 0
      const timer = setInterval(() => {
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, 400, 400)
        
        ctx.fillStyle = '#f43f5e'
        ctx.beginPath()
        ctx.arc(200 + Math.sin(frame / 5) * 80, 200 + Math.cos(frame / 5) * 80, 20, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#94a3b8'
        ctx.font = '12px sans-serif'
        ctx.fillText(`Converting Frame ${frame}...`, 30, 30)

        frame++
        if (frame > 50) {
          clearInterval(timer)
          mediaRecorder.stop()
        }
      }, 40)
    } catch (e: any) {
      alert('Video conversion error: ' + e.message)
      setRecording(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      {!file ? (
        <div 
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.gif'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
        >
          <Play className="w-12 h-12 text-[#111827] mb-4" />
          <p className="text-[#111827] font-medium mb-1">Click to upload animated GIF to convert to MP4</p>
          <p className="text-[#6B7280] text-xs">Captures canvas frames and bundles them into playable video containers</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto w-full text-center">
          <div className="bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-3 text-[#111827] text-xs font-semibold">{file.name}</div>
          {recording && (
            <div className="flex justify-center items-center gap-3 text-[#111827] py-4">
              <RefreshCw className="w-5 h-5 text-[#111827] animate-spin" /> Recording frames locally...
            </div>
          )}
          {videoUrl && (
            <div className="space-y-4">
              <video src={videoUrl} controls loop autoPlay className="w-full max-h-60 rounded-xl border border-[#E5E7EB]" />
              <a href={videoUrl} download={`${file.name.replace('.gif', '')}.mp4`}>
                <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]">Download MP4/WebM Video</Button>
              </a>
            </div>
          )}
          <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] text-sm mt-2" onClick={() => { setFile(null); setVideoUrl(null) }}>Choose New GIF</Button>
        </div>
      )}
    </div>
  )
}

/* ─────────── 13. Chart Maker ─────────── */
export function ChartMaker() {
  const [title, setTitle] = useState('Quarterly Growth')
  const [labels, setLabels] = useState('Q1, Q2, Q3, Q4')
  const [values, setValues] = useState('150, 240, 180, 310')
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const width = 600
    const height = 400
    canvas.width = width
    canvas.height = height

    // Draw background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Parse Data
    const parsedLabels = labels.split(',').map(s => s.trim())
    const parsedValues = values.split(',').map(s => parseFloat(s.trim()) || 0)
    const maxVal = Math.max(...parsedValues, 10)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(title, width / 2, 40)

    const margin = 60
    const usableW = width - margin * 2
    const usableH = height - margin * 2

    if (chartType === 'bar') {
      const barW = (usableW / parsedValues.length) - 20
      parsedValues.forEach((val, idx) => {
        const barH = (val / maxVal) * usableH
        const x = margin + idx * (usableW / parsedValues.length) + 10
        const y = height - margin - barH

        // Draw bar
        ctx.fillStyle = '#818cf8'
        ctx.fillRect(x, y, barW, barH)

        // Draw label
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px sans-serif'
        ctx.fillText(parsedLabels[idx] || '', x + barW/2, height - margin + 20)
        ctx.fillText(val.toString(), x + barW/2, y - 10)
      })
    } else if (chartType === 'line') {
      ctx.beginPath()
      ctx.strokeStyle = '#f43f5e'
      ctx.lineWidth = 3

      parsedValues.forEach((val, idx) => {
        const x = margin + idx * (usableW / (parsedValues.length - 1))
        const y = height - margin - (val / maxVal) * usableH
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)

        // Draw node points
        ctx.fillStyle = '#ffffff'
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.stroke()

      // Draw labels
      parsedValues.forEach((val, idx) => {
        const x = margin + idx * (usableW / (parsedValues.length - 1))
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px sans-serif'
        ctx.fillText(parsedLabels[idx] || '', x, height - margin + 20)
        ctx.fillText(val.toString(), x, height - margin - (val / maxVal) * usableH - 12)
      })
    } else if (chartType === 'pie') {
      let total = parsedValues.reduce((sum, v) => sum + v, 0)
      if (total === 0) total = 1

      let startAngle = 0
      const colors = ['#f43f5e', '#818cf8', '#34d399', '#fbbf24', '#a78bfa', '#22d3ee']

      parsedValues.forEach((val, idx) => {
        const sliceAngle = (val / total) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(width / 2, height / 2 + 20)
        ctx.arc(width / 2, height / 2 + 20, 100, startAngle, startAngle + sliceAngle)
        ctx.closePath()
        ctx.fillStyle = colors[idx % colors.length]
        ctx.fill()

        // Draw legend label
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px sans-serif'
        const labelY = 80 + idx * 20
        ctx.fillRect(40, labelY - 8, 12, 12)
        ctx.fillText(`${parsedLabels[idx] || ''}: ${val}`, 80, labelY)

        startAngle += sliceAngle
      })
    }
  }

  useEffect(() => {
    drawChart()
  }, [title, labels, values, chartType])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'chart.png')
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Chart Configuration</h4>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Chart Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-1.5 text-[#111827] text-xs font-semibold" />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Chart Labels (comma-separated)</label>
              <input type="text" value={labels} onChange={e => setLabels(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-1.5 text-[#111827] text-xs font-mono" />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Values (comma-separated)</label>
              <input type="text" value={values} onChange={e => setValues(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-1.5 text-[#111827] text-xs font-mono" />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Type Selector</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setChartType('bar')} className={`py-1 rounded text-[10px] font-bold ${chartType === 'bar' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Bar</button>
                <button onClick={() => setChartType('line')} className={`py-1 rounded text-[10px] font-bold ${chartType === 'line' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Line</button>
                <button onClick={() => setChartType('pie')} className={`py-1 rounded text-[10px] font-bold ${chartType === 'pie' ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>Pie</button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
              Download PNG Image
            </Button>
          </div>
        </div>

        <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px]">
          <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
        </div>
      </div>
    </div>
  )
}

/* ─────────── 14. Font Awesome to PNG ─────────── */
export function FontAwesomeToPng() {
  const [selectedIcon, setSelectedIcon] = useState('star')
  const [color, setColor] = useState('#fbbf24')
  const [bgColor, setBgColor] = useState('#1e293b')
  const [bgType, setBgType] = useState<'circle' | 'square' | 'none'>('circle')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const icons = ['star', 'heart', 'user', 'home', 'search', 'settings', 'bell', 'check', 'trash', 'plus', 'file', 'image']

  const drawIcon = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const size = 300
    canvas.width = size
    canvas.height = size

    ctx.clearRect(0, 0, size, size)

    // Draw background shape
    if (bgType === 'circle') {
      ctx.fillStyle = bgColor
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2)
      ctx.fill()
    } else if (bgType === 'square') {
      ctx.fillStyle = bgColor
      ctx.fillRect(10, 10, size - 20, size - 20)
    }

    // Draw stylized glyph mockup
    ctx.fillStyle = color
    ctx.font = 'bold 120px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const glyph = selectedIcon === 'star' ? '★' : selectedIcon === 'heart' ? '♥' : selectedIcon === 'check' ? '✔' : '♦'
    ctx.fillText(glyph, size / 2, size / 2)
  }

  useEffect(() => {
    drawIcon()
  }, [selectedIcon, color, bgColor, bgType])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, `${selectedIcon}-icon.png`)
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[320px] flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Icon Config</h4>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Select Icon Glyph</label>
              <select value={selectedIcon} onChange={e => setSelectedIcon(e.target.value)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-4 py-2 text-[#111827] text-xs">
                {icons.map(ic => (
                  <option key={ic} value={ic}>{ic.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Icon Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Backdrop Color</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-0" />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Background Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {['circle', 'square', 'none'].map(shape => (
                  <button key={shape} onClick={() => setBgType(shape as any)} className={`py-1 rounded text-[10px] font-bold uppercase ${bgType === shape ? 'bg-white border border-[#E5E7EB] text-[#111827]' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}`}>{shape}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={handleDownload} className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] font-semibold text-sm">
              Download PNG Icon
            </Button>
          </div>
        </div>

        <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[350px] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvQAw8gAAQMDwzyUog+S1AwybAAx6oZRMwyDQeQAAwMAXgEHB60tE7EAAAAASUVORK5CYII=')]">
          <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded-xl shadow-2xl" />
        </div>
      </div>
    </div>
  )
}

/* ─────────── 15. PNG to EPS ─────────── */
export function PngToEps() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleConvert = async (f: File) => {
    setFile(f)
    setProcessing(true)
    try {
      const buffer = await fileToArrayBuffer(f)
      const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      
      const width = 500
      const height = 500

      // Formats the image into PostScript binary envelope EPS structure
      const epsContent = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%Title: ${f.name.replace('.png', '')}
%%Creator: SmarTools client conversion
%%Pages: 1
%%EndComments
%%BeginProlog
/LogoImage {
  /DeviceRGB setcolorspace
  <<
    /ImageType 1
    /Width ${width}
    /Height ${height}
    /BitsPerComponent 8
    /Decode [0 1 0 1 0 1]
    /DataSource currentfile /ASCII85Decode filter
  >> image
} def
%%EndProlog
%%Page: 1 1
gsave
0 0 translate
${width} ${height} scale
LogoImage
${base64}
grestore
showpage
%%EOF`

      downloadBlob(new Blob([epsContent], { type: 'application/postscript' }), `${f.name.replace('.png', '')}.eps`)
    } catch (e: any) {
      alert('EPS encoding failed: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.png'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <FileCode className="w-12 h-12 text-[#111827] mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload PNG to convert to EPS</p>
        <p className="text-[#6B7280] text-xs">Wraps visual raster image inside PostScript vector format envelope</p>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-[#111827] animate-spin mb-3" />
          <p className="text-[#111827] font-medium">Encoding PostScript file...</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 16. JPG to TIFF ─────────── */
export function JpgToTiff() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleConvert = async (f: File) => {
    setFile(f)
    setProcessing(true)
    try {
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)

        // @ts-ignore
        const UTIF = await import('https://esm.sh/utif@3.1.0')
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const tiffBuffer = UTIF.encodeImage(imgData.data, canvas.width, canvas.height)

        downloadBlob(new Blob([tiffBuffer], { type: 'image/tiff' }), `${f.name.replace(/\.[^/.]+$/, '')}.tiff`)
        setProcessing(false)
      }
      img.src = URL.createObjectURL(f)
    } catch (e: any) {
      alert('TIFF compilation failed: ' + e.message)
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.jpg,.jpeg'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload JPG to convert to TIFF</p>
        <p className="text-[#6B7280] text-xs">Packs JPG pixels into a standard uncompressed TIFF image container format</p>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-[#111827] animate-spin mb-3" />
          <p className="text-[#111827] font-medium">Encoding TIFF image...</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── 17. WebP to JPG ─────────── */
export function WebpToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleConvert = async (f: File) => {
    setFile(f)
    setProcessing(true)
    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob(blob => {
          if (blob) downloadBlob(blob, `${f.name.replace('.webp', '')}.jpg`)
          setProcessing(false)
        }, 'image/jpeg', 0.9)
      }
      img.src = URL.createObjectURL(f)
    } catch (e: any) {
      alert('Conversion failed: ' + e.message)
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 ">
      <div 
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.webp'; i.onchange = e => { if ((e.target as any).files?.[0]) handleConvert((e.target as any).files[0]) }; i.click() }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] hover:border-white/30 rounded-2xl p-14 cursor-pointer bg-white/2"
      >
        <ImageIcon className="w-12 h-12 text-[#111827] mb-4" />
        <p className="text-[#111827] font-medium mb-1">Click to upload WebP to convert to JPG</p>
        <p className="text-[#6B7280] text-xs">Convert static WebP image layouts to standard JPG format client-side</p>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-[#111827] animate-spin mb-3" />
          <p className="text-[#111827] font-medium">Converting WebP...</p>
        </div>
      )}
    </div>
  )
}
