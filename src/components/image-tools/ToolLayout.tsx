import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  title, 
  description, 
  icon,
  children,
  sidebar
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-text-muted hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex items-center gap-3">
          {icon && <div className="p-3 bg-surface border border-border text-text-primary rounded-xl">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
            <p className="text-text-muted mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {children}
        </div>
        
        {sidebar && (
          <div className="lg:col-span-4">
            <div className="bg-card border border-border backdrop-blur border border-border rounded-xl p-6 sticky top-24">
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
