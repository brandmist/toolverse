import React, { useRef, useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  accept = "image/*",
  maxSizeMB = 50
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const isImage = file.type.startsWith('image/');
    const hasValidExt = /\.(svg|tiff|tif|heic|avif)$/i.test(file.name);
    
    if (!isImage && !hasValidExt) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB.`);
      return;
    }
    onImageSelect(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging 
            ? 'border-border bg-surface border border-border' 
            : 'border-border hover:border-border bg-surface border border-border'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-text-primary">
              Drag & Drop your image here
            </p>
            <p className="text-sm text-text-muted mt-1">
              or click to browse from your device
            </p>
          </div>
          <p className="text-xs text-text-muted">
            Supports JPG, PNG, WEBP, GIF up to {maxSizeMB}MB
          </p>
        </div>
      </div>
      {error && <p className="text-danger text-sm mt-3 font-medium text-center">{error}</p>}
    </div>
  );
};
