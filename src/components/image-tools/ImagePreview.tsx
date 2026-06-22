import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onCompare?: () => void;
  isComparing?: boolean;
  originalSrc?: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  src, 
  alt = "Preview", 
  onCompare, 
  isComparing,
  originalSrc 
}) => {
  return (
    <div className="relative w-full h-[500px] bg-surface border border-border rounded-xl overflow-hidden border border-border flex items-center justify-center">
      {/* Checkerboard pattern for transparency */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHADv7//x/GQAxgYmQAMmEwGhg1gIFRCsMZqBoYyABGGQxgYBQGAKaGUBc488O5AAAAAElFTkSuQmCC")',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <img 
        src={isComparing && originalSrc ? originalSrc : src} 
        alt={alt}
        className="max-w-full max-h-full object-contain relative z-10 transition-opacity duration-300"
      />

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface border border-border backdrop-blur border border-border rounded-full p-2 z-20 shadow-xl">
        <button className="p-2 hover:bg-card border border-border rounded-full text-text-primary transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-card border border-border rounded-full text-text-primary transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-card border border-border mx-1"></div>
        <button className="p-2 hover:bg-card border border-border rounded-full text-text-primary transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
        {onCompare && originalSrc && (
          <>
            <div className="w-px h-6 bg-card border border-border mx-1"></div>
            <button 
              onPointerDown={onCompare}
              onPointerUp={onCompare}
              onPointerLeave={() => isComparing && onCompare()}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                isComparing ? 'bg-card border border-border text-text-primary' : 'bg-card border border-border text-text-primary hover:bg-card border border-border'
              }`}
            >
              Hold to Compare
            </button>
          </>
        )}
      </div>
    </div>
  );
};
