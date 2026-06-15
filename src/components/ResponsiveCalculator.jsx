import React, { useState, useEffect, useRef } from 'react';
import DesktopCalculator from './DesktopCalculator';
import MobileCalculator from './MobileCalculator';
import { useTheme } from '../hooks/useTheme';

/**
 * Responsive Dispatcher Component (Container-Query Aware)
 * Detects container-width changes (via ResizeObserver) to switch layouts.
 * This guarantees the mobile layout renders correctly even inside developer device simulators.
 */
const ResponsiveCalculator = ({ mode = 'sip' }) => {
  const containerRef = useRef(null);
  const { isDarkMode } = useTheme();
  
  // Initial fallback check based on window width
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use ResizeObserver to check the actual rendered width of our container
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setIsMobile(width <= 768);
      }
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      {isMobile ? (
        <MobileCalculator mode={mode} />
      ) : (
        <DesktopCalculator mode={mode} />
      )}
    </div>
  );
};

export default ResponsiveCalculator;
