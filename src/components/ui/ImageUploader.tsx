import React, { useState, useCallback, useEffect } from 'react';
import { Upload, AlertCircle, X } from 'lucide-react';
import { useImageTool } from '../../context/ImageToolContext';

interface ImageUploaderProps {
  title?: string;
  subtitle?: string;
}

export function ImageUploader({ 
  title = "Click or drag to upload image", 
  subtitle = "Supports PNG, JPG, WEBP, GIF (up to 50MB)"
}: ImageUploaderProps) {
  const { processFile, handleFileUpload, error, setError } = useImageTool();
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <div className="relative w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden
          ${isDragging 
            ? 'bg-[#FAFAFA] border border-[#E5E7EB] border-[#E5E7EB] text-[#111827]' 
            : 'border-[#E5E7EB] hover:bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#E5E7EB]'
          }`}
      >
        <input 
          type="file" 
          accept="image/*,.svg,.tiff,.tif,.heic,.avif" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleFileUpload} 
          aria-label="Upload image"
        />
        <Upload className={`w-10 h-10 mb-4 transition-transform ${isDragging ? 'scale-110' : ''}`} />
        <span className="text-lg font-medium select-none pointer-events-none">{title}</span>
        <p className="text-sm text-[#6B7280] mt-2 select-none pointer-events-none">{subtitle}</p>
      </div>

      {/* FileErrorToast */}
      <div 
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-3 bg-white border border-[#E5E7EB] border-[#E5E7EB] text-danger rounded-xl shadow-xl shadow-rose-500/10 transition-all duration-300 ease-out pointer-events-auto
          ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">{error}</span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowToast(false);
            setError(null);
          }}
          className="p-1 hover:bg-[#FAFAFA] border border-[#E5E7EB] rounded-md transition-colors shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
