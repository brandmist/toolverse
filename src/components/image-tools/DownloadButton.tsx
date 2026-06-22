import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  url: string | null;
  filename?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  url, 
  filename = 'image.png',
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url) return;
    
    setIsDownloading(true);
    try {
      // Create an anchor element and trigger download programmatically
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      // Small delay for UX
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!url || isDownloading}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${
        !url 
          ? 'bg-card border border-border text-text-muted cursor-not-allowed' 
          : 'bg-card border border-border hover:bg-card-hover text-text-primary'
      } ${className}`}
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      {isDownloading ? 'Downloading...' : 'Download Image'}
    </button>
  );
};
