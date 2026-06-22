import React, { useState, DragEvent } from 'react';

interface DragDropZoneProps {
  onDrop: (file: File) => void;
  children: React.ReactNode;
  className?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({ 
  onDrop, 
  children,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative transition-all duration-200 ${
        isDragging ? 'ring-2 ring-indigo-500 rounded-xl bg-surface border border-border' : ''
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface border border-border backdrop-blur-sm rounded-xl border-2 border-border border-dashed">
          <p className="text-2xl font-bold text-text-primary">Drop image here</p>
        </div>
      )}
      {children}
    </div>
  );
};
