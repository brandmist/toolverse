import React, { useState, useRef } from 'react';
import { ImageUploader } from '../../components/image-tools/ImageUploader';
import { ImagePreview } from '../../components/image-tools/ImagePreview';
import { DownloadButton } from '../../components/image-tools/DownloadButton';
import { ToolLayout } from '../../components/image-tools/ToolLayout';
import { Crop } from 'lucide-react';

export const ImageCrop: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = (file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
    
    // Load image to get original dimensions
    const img = new Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleResize = () => {
    if (!originalUrl) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(originalFile?.type || 'image/png');
        setResultUrl(dataUrl);
      }
    };
    img.src = originalUrl;
  };

  return (
    <ToolLayout
      title="Resize Image"
      description="Change the dimensions of your image quickly."
      icon={<Crop className="w-6 h-6" />}
      sidebar={
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Dimensions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted mb-1">Width (px)</label>
                <input 
                  type="number" 
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-card border border-border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-border"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Height (px)</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-card border border-border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-border"
                />
              </div>
            </div>

            <button
              onClick={handleResize}
              disabled={!originalFile || width <= 0 || height <= 0}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                !originalFile 
                  ? 'bg-card border border-border text-text-muted cursor-not-allowed'
                  : 'bg-card border border-border hover:bg-card-hover text-text-primary'
              }`}
            >
              Apply Resize
            </button>
          </div>

          {resultUrl && (
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Export</h3>
              <DownloadButton 
                url={resultUrl} 
                filename={`resized_${originalFile?.name || 'image.png'}`} 
                className="w-full"
              />
            </div>
          )}
        </div>
      }
    >
      {!originalUrl ? (
        <ImageUploader onImageSelect={handleImageSelect} />
      ) : (
        <ImagePreview 
          src={resultUrl || originalUrl} 
        />
      )}
    </ToolLayout>
  );
};
