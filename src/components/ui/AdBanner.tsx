import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  height: number;
  width: number;
  format?: string;
  className?: string;
}

export function AdBanner({ adKey, height, width, format = 'iframe', className = '' }: AdBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    // Check if script already appended to prevent duplicates in dev mode
    if (bannerRef.current.firstChild) {
      return;
    }

    const conf = document.createElement('script');
    const script = document.createElement('script');
    
    script.type = 'text/javascript';
    script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = {
      'key': '${adKey}',
      'format': '${format}',
      'height': ${height},
      'width': ${width},
      'params': {}
    };`;

    bannerRef.current.append(conf);
    bannerRef.current.append(script);
  }, [adKey, height, width, format]);

  return (
    <div className={`flex justify-center items-center overflow-hidden w-full my-4 ${className}`}>
      <div ref={bannerRef} style={{ minHeight: height, minWidth: width }} />
    </div>
  );
}
