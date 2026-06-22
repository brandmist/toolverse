import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:p-8 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-6 pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-surface rounded-lg border border-border">
              <Cookie className="w-5 h-5 text-text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">We value your privacy</h3>
          </div>
          <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
            We use essential local storage to remember your preferences and ensure the platform runs smoothly. We do not use intrusive third-party tracking cookies. By continuing to use SmarTools, you agree to our{' '}
            <Link to="/cookie" className="text-text-primary font-bold hover:underline">
              Cookie Policy
            </Link>
            {' '}and{' '}
            <Link to="/gdpr" className="text-text-primary font-bold hover:underline">
              GDPR Compliance
            </Link>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-border text-text-primary font-bold hover:bg-surface transition-colors text-sm"
          >
            Decline All
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-button-primary text-button-primary-text font-bold hover:opacity-90 transition-opacity text-sm shadow-sm"
          >
            Accept
          </button>
        </div>

        <button 
          onClick={handleDecline}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-lg hover:bg-surface transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
