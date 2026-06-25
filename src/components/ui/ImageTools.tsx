import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Upload, Download, Copy, Image as ImageIcon } from 'lucide-react'
import { useImageTool } from '../../context/ImageToolContext'
import { ImageUploader } from './ImageUploader'
import DOMPurify from 'dompurify'

// 1. Image to Base64
export function ImageToBase64() {
  const { imageSrc, isProcessing, error, handleFileUpload, clearImage } = useImageTool()
  const [base64, setBase64] = useState('')

  useEffect(() => {
    if (imageSrc) {
       fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
             const reader = new FileReader();
             reader.onloadend = () => setBase64(reader.result as string);
             reader.readAsDataURL(blob);
          });
    } else {
       setBase64('');
    }
  }, [imageSrc]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        {!imageSrc && (
          <ImageUploader />
        )}
        {base64 && (
          <div className="relative">
            <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex items-center justify-center max-h-[300px] overflow-hidden border border-[#E5E7EB]">
              <img src={base64} alt="Preview" className="max-w-full max-h-[280px] object-contain rounded-xl" />
            </div>
            <Button variant="outline" size="sm" className="absolute top-3 right-2 border-[#E5E7EB] hover:bg-white/20 bg-black/50 text-[#111827]" onClick={clearImage}>
              Clear
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col h-[400px] md:h-auto">
        <div className="flex justify-between items-center mb-2">
           <span className="text-sm font-medium text-[#111827]">Base64 String</span>
           {base64 && (
             <Button variant="ghost" size="sm" className="h-8 text-[#6B7280] hover:text-[#111827]" onClick={() => navigator.clipboard.writeText(base64)}>
               <Copy className="w-3 h-3 mr-2" /> Copy
             </Button>
           )}
        </div>
        <textarea
          readOnly
          className="w-full flex-grow p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-success font-mono text-xs break-all"
          value={base64}
          placeholder={isProcessing ? "Processing..." : "Base64 output will appear here..."}
        />
      </div>
    </div>
  )
}

// 2. SVG Blob Generator (fixed: useEffect for initial mount, better blob algorithm)
export function SvgBlobGenerator() {
  const [blob, setBlob] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [complexity, setComplexity] = useState(6)

  const generateBlob = () => {
    const points = complexity
    const slices = (2 * Math.PI) / points
    const radii: number[] = []
    for (let i = 0; i < points; i++) {
      radii.push(28 + Math.random() * 22)
    }

    let d = ''
    const coords = radii.map((r, i) => ({
      x: 50 + r * Math.cos(i * slices - Math.PI / 2),
      y: 50 + r * Math.sin(i * slices - Math.PI / 2),
    }))

    for (let i = 0; i < coords.length; i++) {
      const curr = coords[i]
      const next = coords[(i + 1) % coords.length]
      const prev = coords[(i - 1 + coords.length) % coords.length]
      if (i === 0) d += `M ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`
      const cp1x = curr.x + (next.x - prev.x) * 0.15
      const cp1y = curr.y + (next.y - prev.y) * 0.15
      const cp2x = next.x - (coords[(i + 2) % coords.length].x - curr.x) * 0.15
      const cp2y = next.y - (coords[(i + 2) % coords.length].y - curr.y) * 0.15
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`
    }
    d += ' Z'

    const svgCode = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <path fill="${color}" d="${d}" />\n</svg>`
    setBlob(svgCode)
  }

  useEffect(() => { generateBlob() }, [color, complexity])

  const downloadSvg = () => {
    const blobFile = new Blob([blob], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blobFile)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blob.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 space-y-6">
        <div>
           <div className="flex justify-between mb-1">
             <span className="text-sm text-[#111827]">Blob Color</span>
             <span className="text-sm text-[#6B7280] font-mono">{color}</span>
           </div>
           <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-12 rounded cursor-pointer bg-transparent border-0" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-[#111827]">Complexity</span>
            <span className="text-sm text-[#6B7280]">{complexity} points</span>
          </div>
          <input type="range" min="3" max="12" value={complexity} onChange={e => setComplexity(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0" onClick={generateBlob}>
          🎲 Generate New Blob
        </Button>
        <div className="pt-2">
           <span className="text-sm text-[#111827] mb-2 block">SVG Code</span>
           <textarea
             readOnly
             className="w-full h-28 p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl resize-none text-success font-mono text-xs break-all"
             value={blob}
           />
           <div className="grid grid-cols-2 gap-3 mt-2">
             <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={() => navigator.clipboard.writeText(blob)}>
               Copy SVG Code
             </Button>
             <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-0" onClick={downloadSvg}>
               Download SVG
             </Button>
           </div>
        </div>
      </div>
      <div className="flex-[1.5] flex items-center justify-center p-8 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] min-h-[300px]">
         <div
           className="w-full max-w-[300px] aspect-square transition-all duration-500 ease-in-out"
           dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blob) }}
         />
      </div>
    </div>
  )
}

// 3. Image Resizer
export function ImageResizer() {
  const { imageSrc, imageElement, error, handleFileUpload, clearImage, downloadImage, renderToCanvas } = useImageTool()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (imageElement) {
        setWidth(imageElement.width)
        setHeight(imageElement.height)
    }
  }, [imageElement])

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (maintainAspect && imageElement) {
      setHeight(Math.round(val * (imageElement.height / imageElement.width)))
    }
  }

  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (maintainAspect && imageElement) {
      setWidth(Math.round(val * (imageElement.width / imageElement.height)))
    }
  }

  const downloadResized = () => {
    if (!imageElement || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = Math.max(1, width)
    canvas.height = Math.max(1, height)
    renderToCanvas(imageElement, canvas, (ctx, cw, ch) => {
      ctx.drawImage(imageElement, 0, 0, cw, ch)
    })
    downloadImage(canvas, 'image/png', undefined, 'resized-image')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#111827] mb-4">Resize Settings</h3>
            <div>
              <label className="text-sm text-[#111827] block mb-1">Width (px)</label>
              <input type="number" value={width} onChange={e => handleWidthChange(parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-2 text-[#111827]" />
            </div>
            <div>
              <label className="text-sm text-[#111827] block mb-1">Height (px)</label>
              <input type="number" value={height} onChange={e => handleHeightChange(parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl px-3 py-2 text-[#111827]" />
            </div>
            <label className="flex items-center space-x-2 text-[#111827] cursor-pointer pt-2">
              <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="w-4 h-4 rounded border-[#E5E7EB] bg-white border border-[#E5E7EB]" />
              <span className="text-sm">Maintain Aspect Ratio</span>
            </label>
            <div className="pt-4 flex gap-2">
              <Button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={downloadResized}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={clearImage}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[1.5] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[300px] overflow-hidden">
            <img src={imageSrc} alt="Original" className="max-w-full max-h-[400px] object-contain opacity-50" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  )
}

// 4. Color Extractor
export function ColorExtractor() {
  const { imageSrc, imageElement, error, handleFileUpload, clearImage, renderToCanvas } = useImageTool()
  const [colors, setColors] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
     if (imageElement && canvasRef.current) {
        extractColors(imageElement)
     } else {
        setColors([])
     }
  }, [imageElement])

  const extractColors = (img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Low res extraction for speed
    canvas.width = 100
    canvas.height = 100
    
    renderToCanvas(img, canvas, (ctx, cw, ch) => {
       ctx.drawImage(img, 0, 0, cw, ch)
       const imageData = ctx.getImageData(0, 0, cw, ch).data
       const colorCounts: Record<string, number> = {}
       
       for (let i = 0; i < imageData.length; i += 16) { // skip sample rate
         const r = Math.round(imageData[i] / 10) * 10
         const g = Math.round(imageData[i + 1] / 10) * 10
         const b = Math.round(imageData[i + 2] / 10) * 10
         const hex = `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`
         colorCounts[hex] = (colorCounts[hex] || 0) + 1
       }
       
       const sortedColors = Object.entries(colorCounts)
         .sort((a, b) => b[1] - a[1])
         .slice(0, 6)
         .map(entry => entry[0])
         
       setColors(sortedColors)
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-[1.5] flex flex-col gap-4">
        {!imageSrc ? (
          <ImageUploader title="Upload image to extract colors" />
        ) : (
          <div className="relative">
            <img src={imageSrc} alt="Preview" className="w-full rounded-xl object-contain bg-white border border-[#E5E7EB] max-h-[400px]" />
            <Button variant="outline" size="sm" className="absolute top-3 right-2 border-[#E5E7EB] hover:bg-white/20 bg-black/50 text-[#111827]" onClick={clearImage}>
              Clear
            </Button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex-1 right-panel flex flex-col gap-3">
         <h3 className="font-semibold text-[#111827] mb-2">Dominant Colors</h3>
         {colors.length > 0 ? (
           <div className="grid grid-cols-2 gap-3">
             {colors.map((color, idx) => (
               <div key={idx} className="flex flex-col bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl overflow-hidden group cursor-pointer" onClick={() => { navigator.clipboard.writeText(color); }}>
                 <div className="h-16 w-full transition-transform group-hover:scale-105" style={{ backgroundColor: color }}></div>
                 <div className="p-3 flex justify-between items-center text-sm">
                   <span className="text-[#111827] font-mono uppercase">{color}</span>
                   <Copy className="w-3 h-3 text-[#6B7280] group-hover:text-[#111827]" />
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="flex items-center justify-center h-48 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm p-6 text-center">
             Colors will appear here once an image is processed
           </div>
         )}
      </div>
    </div>
  )
}

export function ImageCropper() {
  const { imageSrc, imageElement, error, handleFileUpload, clearImage, renderToCanvas, downloadImage } = useImageTool()
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 50, height: 50 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDownload = () => {
    if (!imageElement || !canvasRef.current) return
    const canvas = canvasRef.current
    
    // Scale crop box to original image dimensions
    const scaleX = imageElement.width / 100 // 100% based
    const scaleY = imageElement.height / 100
    
    const cw = Math.max(1, cropBox.width * scaleX)
    const ch = Math.max(1, cropBox.height * scaleY)
    const cx = Math.max(0, cropBox.x * scaleX)
    const cy = Math.max(0, cropBox.y * scaleY)
    
    canvas.width = Math.max(1, cw) // Prevent exact 0
    canvas.height = Math.max(1, ch)
    
    renderToCanvas(imageElement, canvas, (ctx, width, height) => {
        ctx.drawImage(imageElement, cx, cy, cw, ch, 0, 0, width, height)
    })
    
    downloadImage(canvas, 'image/png', undefined, 'cropped-image')
  }

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[300px]">
             <h3 className="font-semibold text-[#111827] mb-4">Crop Area (%)</h3>
             <div>
               <label className="text-sm text-[#111827] block mb-1">X Offset: {cropBox.x}%</label>
               <input type="range" min="0" max="100" value={cropBox.x} onChange={e => setCropBox({...cropBox, x: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
             </div>
             <div>
               <label className="text-sm text-[#111827] block mb-1">Y Offset: {cropBox.y}%</label>
               <input type="range" min="0" max="100" value={cropBox.y} onChange={e => setCropBox({...cropBox, y: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
             </div>
             <div>
               <label className="text-sm text-[#111827] block mb-1">Width: {cropBox.width}%</label>
               <input type="range" min="1" max="100" value={cropBox.width} onChange={e => setCropBox({...cropBox, width: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
             </div>
             <div>
               <label className="text-sm text-[#111827] block mb-1">Height: {cropBox.height}%</label>
               <input type="range" min="1" max="100" value={cropBox.height} onChange={e => setCropBox({...cropBox, height: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
             </div>
             
             <div className="pt-4 flex gap-2">
              <Button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Crop & Save
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={clearImage}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[300px]">
             <div className="relative inline-block max-w-full max-h-[400px]">
                <img src={imageSrc} alt="Preview" className="max-w-full max-h-[400px] object-contain opacity-50 block" />
                <div 
                  className="absolute border-2 border-dashed border-white bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                  style={{
                    left: `${Math.min(cropBox.x, 100 - cropBox.width)}%`,
                    top: `${Math.min(cropBox.y, 100 - cropBox.height)}%`,
                    width: `${Math.min(cropBox.width, 100 - cropBox.x)}%`,
                    height: `${Math.min(cropBox.height, 100 - cropBox.y)}%`,
                  }}
                />
             </div>
             <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  )
}

