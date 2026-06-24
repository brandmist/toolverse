import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './button';
import { Download, Sparkles, Scissors, Image as ImageIcon, CheckCircle, RefreshCcw, Eraser, Activity, ScanText, Loader2 } from 'lucide-react';
import { useImageTool } from '../../context/ImageToolContext';
import { ImageUploader } from './ImageUploader';
import Tesseract from 'tesseract.js';
import { removeBackground } from '@imgly/background-removal';

// 1. AI Image Generator
export function AIImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState('');
  const [size, setSize] = useState('1024x1024');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImgUrl('');
    
    const [width, height] = size.split('x');
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
    
    const img = new Image();
    img.onload = () => {
      setGeneratedImgUrl(url);
      setIsGenerating(false);
    };
    img.onerror = () => {
      setIsGenerating(false);
      alert('Generation failed or timed out. Please try a different prompt.');
    };
    img.src = url;
  };

  const handleDownload = async () => {
    if (!generatedImgUrl) return;
    try {
      const response = await fetch(generatedImgUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `ai-generated-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      window.open(generatedImgUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[350px] flex flex-col">
          <h3 className="font-semibold text-[#111827] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#111827]" />
            AI Generator
          </h3>
          <p className="text-sm text-[#6B7280]">Describe what you want to see, and AI will generate it for free.</p>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm text-[#111827] block mb-2">Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A cyberpunk city at night with neon lights..."
                className="w-full bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#E5E7EB] min-h-[120px] resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-[#111827] block mb-2">Size</label>
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#E5E7EB]"
              >
                <option value="1024x1024">Square (1024x1024)</option>
                <option value="1024x576">Landscape (16:9)</option>
                <option value="576x1024">Portrait (9:16)</option>
              </select>
            </div>
          </div>

          <Button 
            className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] mt-auto" 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>
            ) : (
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate Image</span>
            )}
          </Button>
        </div>

        <div className="flex-[2] flex flex-col items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[400px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 text-[#6B7280]">
              <Loader2 className="w-12 h-12 animate-spin text-[#111827]" />
              <p>Creating your image...</p>
            </div>
          ) : generatedImgUrl ? (
            <div className="relative group w-full h-full flex items-center justify-center">
              <img src={generatedImgUrl} alt="Generated UI" className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                <Button className="bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#6B7280] gap-4">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p className="max-w-xs text-center text-sm">Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Remove Background
export function RemoveBackground() {
  const { imageSrc, imageElement, error, clearImage } = useImageTool();
  const [processedUrl, setProcessedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const processImage = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setProgressMsg('Loading AI models (can take 10-30s)...');
    
    try {
      const blob = await removeBackground(imageSrc, {
        progress: (key: string, current: number, total: number) => {
          setProgressMsg(`Processing (${Math.round((current / total) * 100)}%)`);
        }
      });
      setProcessedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setProgressMsg('Error removing background.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `bg-removed-${Date.now()}.png`;
    link.click();
  };

  const handleClear = () => {
    clearImage();
    setProcessedUrl('');
    setProgressMsg('');
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader title="Upload image to remove background" subtitle="Models run locally in your browser for privacy." />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[300px]">
            <h3 className="font-semibold text-[#111827] flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#111827]" />
              Background Remover
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Automatically remove the background from your images. First run might take longer to download models.
            </p>
            
            <div className="pt-4 flex flex-col gap-3">
              {!processedUrl ? (
                <Button 
                  className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" 
                  onClick={processImage}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {progressMsg}</span>
                  ) : (
                    <span className="flex items-center gap-2"><Scissors className="w-4 h-4" /> Remove Background</span>
                  )}
                </Button>
              ) : (
                <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" /> Download Transparent Image
                </Button>
              )}
              <Button variant="outline" className="w-full border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={handleClear} disabled={isProcessing}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[300px] overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvQAw8gAAQMDwzyUog+S1AwybAAx6oZRMwyDQeQAAwMAXgEHB60tE7EAAAAASUVORK5CYII=')]">
            <img 
              src={processedUrl || imageSrc} 
              alt="Preview" 
              className={`max-w-full max-h-[400px] object-contain rounded-xl shadow-2xl transition-all duration-500 ${isProcessing ? 'opacity-50 blur-sm' : ''}`} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Image To Text (OCR)
export function ImageToText() {
  const { imageSrc, clearImage } = useImageTool();
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const processImage = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setText('');
    setProgressMsg('Loading Tesseract OCR...');
    
    try {
      const result = await Tesseract.recognize(imageSrc, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgressMsg(`Recognizing (${Math.round(m.progress * 100)}%)`);
          } else {
             setProgressMsg(m.status);
          }
        }
      });
      setText(result.data.text);
    } catch (err) {
      console.error(err);
      setProgressMsg('Failed to read text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    clearImage();
    setText('');
    setProgressMsg('');
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader title="Upload image with text" subtitle="Extract text seamlessly in your browser using OCR." />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[1] flex flex-col gap-4">
             <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex items-center justify-center overflow-hidden border border-[#E5E7EB] h-[300px]">
               <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl" />
             </div>
             
             {!text && !isProcessing && (
               <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={processImage}>
                 <ScanText className="w-4 h-4 mr-2" /> Extract Text
               </Button>
             )}
             {isProcessing && (
                <div className="flex items-center justify-center p-3 text-[#111827] bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] gap-2">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   <span className="text-sm font-medium">{progressMsg}</span>
                </div>
             )}
             <Button variant="outline" className="w-full border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={handleClear} disabled={isProcessing}>
               Clear Image
             </Button>
          </div>
          
          <div className="flex-[1.5] bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] p-4 flex flex-col relative min-h-[300px]">
             {text ? (
               <>
                 <textarea 
                   readOnly 
                   className="w-full flex-1 bg-transparent resize-none text-[#111827] text-sm focus:outline-none" 
                   value={text} 
                 />
                 <Button size="sm" className="absolute top-4 right-4 bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827] border-[#E5E7EB]" onClick={handleCopy}>
                   {copied ? <CheckCircle className="w-4 h-4 mr-2 text-success" /> : <RefreshCcw className="w-4 h-4 mr-2" />} 
                   {copied ? 'Copied' : 'Copy Text'}
                 </Button>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-[#6B7280] gap-4">
                 <ScanText className="w-12 h-12 opacity-20" />
                 <p className="text-sm">Extracted text will appear here</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Unblur Image (Sharpen Filter)
export function UnblurImage() {
  const { imageSrc, imageElement, clearImage, downloadImage } = useImageTool();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [intensity, setIntensity] = useState(1);
  const [scale, setScale] = useState(1);
  const [processed, setProcessed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const applySharpen = () => {
    if (!imageElement || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      const w = Math.floor(imageElement.width * scale);
      const h = Math.floor(imageElement.height * scale);
      canvas.width = w;
      canvas.height = h;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageElement, 0, 0, w, h);
      
      if (intensity > 0) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const copy = new Uint8ClampedArray(data);
        
        const wA = -intensity;
        const wB = 1 + 4 * intensity;
        
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
              const val = 
                wB * copy[i + c] +
                wA * (copy[i - 4 + c] + copy[i + 4 + c] + copy[i - w * 4 + c] + copy[i + w * 4 + c]);
              data[i + c] = Math.min(255, Math.max(0, val));
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
      setProcessed(true);
      setIsProcessing(false);
    }, 50);
  };

  useEffect(() => {
    if (imageElement) {
       applySharpen();
    }
  }, [imageElement, intensity, scale]);

  const handleDownload = () => {
    downloadImage(canvasRef.current, 'image/png', undefined, 'sharpened-image');
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader title="Upload blurry image" subtitle="Applies a local sharpening filter to improve clarity." />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[300px]">
            <h3 className="font-semibold text-[#111827] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#111827]" />
              Sharpen / Unblur
            </h3>
            
            <div className="pt-2 flex flex-col gap-4">
               <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-sm text-[#111827]">Upscale (Resolution)</label>
                   <span className="text-sm text-[#6B7280]">{scale}x</span>
                 </div>
                 <select 
                   value={scale} 
                   onChange={(e) => setScale(parseFloat(e.target.value))}
                   className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg p-2 text-sm"
                 >
                   <option value="1">1x (Original)</option>
                   <option value="1.5">1.5x</option>
                   <option value="2">2x (HD)</option>
                   <option value="4">4x (Ultra HD)</option>
                 </select>
               </div>
               <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-sm text-[#111827]">Sharpen Intensity</label>
                   <span className="text-sm text-[#6B7280]">{intensity}x</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="3" step="0.1" 
                   value={intensity} 
                   onChange={(e) => setIntensity(parseFloat(e.target.value))} 
                   className="w-full accent-indigo-500" 
                 />
                 <p className="text-xs text-[#6B7280] mt-2">Increase to add edge contrast.</p>
               </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-3">
              <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload} disabled={!processed}>
                <Download className="w-4 h-4 mr-2" /> Download Result
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={clearImage}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex items-center justify-center p-4 bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] min-h-[300px] overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

// 5. Cleanup Picture (Basic Smudge/Inpaint)
export function CleanupPicture() {
  const { imageSrc, imageElement, clearImage, renderToCanvas, downloadImage } = useImageTool();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);

  useEffect(() => {
    if (imageElement && canvasRef.current) {
        renderToCanvas(imageElement, canvasRef.current);
    }
  }, [imageElement, renderToCanvas]);

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !imageElement) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const radius = brushSize * scaleX;

    // Fast Hardware-Accelerated Smudge/Blur
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = 0.15;
    
    // Draw the canvas onto itself with slight random offsets to simulate smudging/blurring
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 1.5;
      const offsetY = (Math.random() - 0.5) * radius * 1.5;
      ctx.drawImage(canvas, offsetX, offsetY);
    }
    
    ctx.restore();
  };

  const handleDownload = () => {
    downloadImage(canvasRef.current, 'image/png', undefined, 'cleaned-image');
  };

  const resetCanvas = () => {
    if (imageElement && canvasRef.current) {
        renderToCanvas(imageElement, canvasRef.current);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      {!imageSrc ? (
        <ImageUploader title="Upload image to cleanup" subtitle="Use our manual smudge/blur brush to hide sensitive info or dust." />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-xl border border-[#E5E7EB] max-w-[300px]">
            <h3 className="font-semibold text-[#111827] flex items-center gap-2">
              <Eraser className="w-5 h-5 text-[#111827]" />
              Cleanup / Blur Brush
            </h3>
            
            <p className="text-sm text-[#6B7280] mb-4">
               Click and drag over the image to smudge and hide objects or blemishes.
            </p>

            <div className="pt-2">
               <div className="flex justify-between mb-1">
                 <label className="text-sm text-[#111827]">Brush Size</label>
                 <span className="text-sm text-[#6B7280]">{brushSize}px</span>
               </div>
               <input 
                 type="range" 
                 min="5" max="100" step="1" 
                 value={brushSize} 
                 onChange={(e) => setBrushSize(parseInt(e.target.value))} 
                 className="w-full accent-indigo-500" 
               />
            </div>
            
            <div className="pt-4 flex flex-col gap-3">
              <Button className="w-full bg-white border border-[#E5E7EB] hover:bg-white-hover text-[#111827]" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] hover:bg-white/10 text-[#111827]" onClick={resetCanvas}>
                Undo All
              </Button>
              <Button variant="outline" className="w-full border-[#E5E7EB] hover:bg-[#FAFAFA] border border-[#E5E7EB] text-danger" onClick={clearImage}>
                Choose New Image
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex justify-center bg-white border border-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden touch-none relative">
            <canvas 
              ref={canvasRef} 
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseOut={() => setIsDrawing(false)}
              onMouseMove={draw}
              onTouchStart={(e) => { setIsDrawing(true); draw(e as any); }}
              onTouchEnd={() => setIsDrawing(false)}
              onTouchCancel={() => setIsDrawing(false)}
              onTouchMove={(e) => draw(e as any)}
              className="max-w-full max-h-[500px] object-contain cursor-crosshair shadow-2xl touch-none" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
