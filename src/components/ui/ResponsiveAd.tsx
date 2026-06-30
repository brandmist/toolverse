import { useEffect, useState, useRef } from 'react';
import { AdBanner } from './AdBanner';
import { NativeAd } from './NativeAd';

type AdType = 'horizontal' | 'rectangle' | 'sidebar' | 'native';

interface ResponsiveAdProps {
  type: AdType;
  className?: string;
}

export function ResponsiveAd({ type, className = '' }: ResponsiveAdProps) {
  const [adConfig, setAdConfig] = useState<{ key: string, w: number, h: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine which ad to show based on type and screen size
    const width = window.innerWidth;
    
    if (type === 'horizontal') {
      if (width >= 1024) {
        setAdConfig({ key: '1026c12149117e16c7ccce72edad6371', w: 728, h: 90 });
      } else if (width >= 768) {
        setAdConfig({ key: '820ae9a9c66d98143fc406aca9ac626f', w: 468, h: 60 });
      } else {
        setAdConfig({ key: '52d14c4cfc4b28a541def0f2dbd7b118', w: 300, h: 250 });
      }
    } else if (type === 'sidebar') {
      if (width >= 1024) {
        setAdConfig({ key: '81045c2de93bfbab7c8203b44ab27f1c', w: 160, h: 600 });
      } else {
        setAdConfig(null);
      }
    } else if (type === 'rectangle') {
      setAdConfig({ key: '52d14c4cfc4b28a541def0f2dbd7b118', w: 300, h: 250 });
    }
  }, [type]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' } // Pre-load slightly before coming into view
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (type === 'native') {
    return (
      <div ref={containerRef} className={`flex justify-center items-center overflow-hidden w-full my-8 min-h-[280px] ${className}`}>
        {isVisible && <NativeAd />}
      </div>
    );
  }

  // If sidebar is requested on mobile, it resolves to null config, so return null
  if (type === 'sidebar' && !adConfig) {
    return null;
  }

  // Pre-calculate reserved minimum heights based on type to prevent CLS
  let minHClass = 'min-h-[250px]'; // default fallback
  if (type === 'horizontal') {
    // 300x250 on mobile, 468x60 on tablet, 728x90 on desktop
    minHClass = 'min-h-[250px] md:min-h-[60px] lg:min-h-[90px]';
  } else if (type === 'sidebar') {
    minHClass = 'hidden lg:flex min-h-[600px]';
  } else if (type === 'rectangle') {
    minHClass = 'min-h-[250px]';
  }

  return (
    <div ref={containerRef} className={`flex justify-center items-center overflow-hidden w-full my-8 ${minHClass} ${className}`}>
       {isVisible && adConfig && (
         <AdBanner adKey={adConfig.key} width={adConfig.w} height={adConfig.h} className="!my-0" />
       )}
    </div>
  );
}
