import { useEffect, useRef } from 'react';

export function PopunderManager() {
  const activated = useRef(false);

  useEffect(() => {
    // Check if we already activated this session to prevent continuous popunders on refresh
    if (sessionStorage.getItem('popunders_activated')) return;

    let clickCount = 0;
    // Randomly pick a target between 3 and 5 clicks
    const targetClicks = Math.floor(Math.random() * 3) + 3;

    const activatePopunders = () => {
      if (activated.current) return;
      activated.current = true;
      sessionStorage.setItem('popunders_activated', 'true');

      // Inject script 1
      const s1 = document.createElement('script');
      s1.src = "https://pl29863425.effectivecpmnetwork.com/27/f8/2e/27f82e10d33bcd5df98b3f8b7e5e6079.js";
      document.body.appendChild(s1);

      // Inject script 2
      const s2 = document.createElement('script');
      s2.src = "https://pl29863421.effectivecpmnetwork.com/3a/7e/9d/3a7e9dd8a525bbe2ef704ede1b9cd947.js";
      document.body.appendChild(s2);

      // Cleanup
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };

    const handleClick = () => {
      clickCount++;
      if (clickCount >= targetClicks) {
        activatePopunders();
      }
    };

    // Activate after 5 minutes regardless of clicks
    const timer = setTimeout(() => {
      activatePopunders();
    }, 5 * 60 * 1000);

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
