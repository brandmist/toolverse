import { useEffect, useRef } from 'react';

export function NativeAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (containerRef.current.querySelector('script')) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = `https://pl29863424.effectivecpmnetwork.com/f71075d0839b692b3cb637fedcb7baae/invoke.js`;
    
    containerRef.current.append(script);
  }, []);

  return (
    <div className={`flex justify-center items-center w-full my-4 ${className}`} ref={containerRef}>
      <div id="container-f71075d0839b692b3cb637fedcb7baae"></div>
    </div>
  );
}
