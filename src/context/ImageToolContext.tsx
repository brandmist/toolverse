import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';

export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';

export interface ImageToolState {
  imageSrc: string | null;
  imageElement: HTMLImageElement | null;
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export interface ImageToolContextType extends ImageToolState {
  processFile: (file: File) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  setProcessing: (status: boolean) => void;
  setProgress: (prog: number) => void;
  setError: (err: string | null) => void;
  downloadImage: (canvas: HTMLCanvasElement | null, format: ImageFormat, quality?: number, filename?: string) => void;
  convertImageToFormat: (img: HTMLImageElement, format: ImageFormat, quality?: number) => Promise<string>;
  renderToCanvas: (img: HTMLImageElement, canvas: HTMLCanvasElement, operations?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void) => void;
}

const ImageToolContext = createContext<ImageToolContextType | undefined>(undefined);

export function ImageToolProvider({ children }: { children: ReactNode }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const prevObjectURL = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevObjectURL.current) {
        URL.revokeObjectURL(prevObjectURL.current);
      }
    };
  }, []);

  const processFile = useCallback((file: File) => {
    // 50MB limit for client side
    if (file.size > 50 * 1024 * 1024) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const hasValidExt = /\.(svg|tiff|tif|heic|avif)$/i.test(file.name);
    
    if (!isImage && !hasValidExt) {
        setError('Invalid file type. Please upload an image.');
        return;
    }

    setError(null);
    setProcessing(true);
    setProgress(10);

    const objectUrl = URL.createObjectURL(file);
    if (prevObjectURL.current) {
      URL.revokeObjectURL(prevObjectURL.current);
    }
    prevObjectURL.current = objectUrl;

    const img = new Image();
    img.onload = () => {
      setImageSrc(objectUrl);
      setImageElement(img);
      setProcessing(false);
      setProgress(100);
    };
    img.onerror = () => {
      setError('Failed to load image. It might be corrupted or unsupported.');
      setProcessing(false);
      setProgress(0);
    };
    img.src = objectUrl;
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, [processFile]);

  const clearImage = useCallback(() => {
    setImageSrc(null);
    setImageElement(null);
    setProgress(0);
    setError(null);
    if (prevObjectURL.current) {
      URL.revokeObjectURL(prevObjectURL.current);
      prevObjectURL.current = null;
    }
  }, []);

  const renderToCanvas = useCallback((
    img: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    operations?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Failed to get canvas context');
      return;
    }
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (operations) {
      operations(ctx, canvas.width, canvas.height);
    } else {
      ctx.drawImage(img, 0, 0);
    }
  }, []);

  const convertImageToFormat = useCallback(async (img: HTMLImageElement, format: ImageFormat, quality = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get 2D context");
        ctx.drawImage(img, 0, 0);
        
        if (format === 'image/svg+xml') {
            const b64 = canvas.toDataURL('image/png');
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><image href="${b64}" width="${img.width}" height="${img.height}"/></svg>`;
            const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            resolve(URL.createObjectURL(svgBlob));
            return;
        }

        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  const downloadImage = useCallback((canvas: HTMLCanvasElement | null, format: ImageFormat, quality = 0.9, filename = 'download') => {
    if (!canvas) {
        setError('No canvas available to download');
        return;
    }
    
    try {
        if (format === 'image/svg+xml') {
            const b64 = canvas.toDataURL('image/png');
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${b64}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
            const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const link = document.createElement('a');
            link.download = `${filename}.svg`;
            link.href = svgUrl;
            link.click();
            URL.revokeObjectURL(svgUrl);
            return;
        }

        const link = document.createElement('a');
        const ext = format === 'image/jpeg' ? 'jpg' : format.split('/')[1];
        link.download = `${filename}.${ext}`;
        link.href = canvas.toDataURL(format, quality);
        link.click();
    } catch (err) {
        setError("Failed to download image");
    }
  }, []);

  return (
    <ImageToolContext.Provider
      value={{
        imageSrc,
        imageElement,
        isProcessing,
        progress,
        error,
        processFile,
        handleFileUpload,
        clearImage,
        setProcessing,
        setProgress,
        setError,
        downloadImage,
        convertImageToFormat,
        renderToCanvas
      }}
    >
      {children}
    </ImageToolContext.Provider>
  );
}

export function useImageTool() {
  const context = useContext(ImageToolContext);
  if (context === undefined) {
    throw new Error('useImageTool must be used within an ImageToolProvider');
  }
  return context;
}
