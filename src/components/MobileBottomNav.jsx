import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  IconHome, IconTrendingUp, IconWallet, IconTarget, IconBank,
  IconCalculator, IconScale, IconBook, IconMore, IconClose,
} from './icons';

// Four primary tabs always fit the smallest phones; everything else lives in the
// glass "More" sheet — a web-app pattern that removes the need for a hamburger.
const PRIMARY = [
  { path: '/', Icon: IconHome, label: 'Home' },
  { path: '/sip', Icon: IconTrendingUp, label: 'SIP' },
  { path: '/lumpsum', Icon: IconWallet, label: 'Lumpsum' },
  { path: '/goals', Icon: IconTarget, label: 'Goal' },
];

const MORE = [
  { path: '/swp', Icon: IconBank, label: 'SWP' },
  { path: '/emi', Icon: IconCalculator, label: 'EMI' },
  { path: '/compare', Icon: IconScale, label: 'Compare' },
  { path: '/reverse', Icon: IconCalculator, label: 'XIRR' },
  { path: '/glossary', Icon: IconBook, label: 'Glossary' },
];

const MobileBottomNav = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const moreActive = MORE.some((m) => isActive(m.path));

  const itemColor = (active) =>
    active
      ? 'var(--color-primary)'
      : isDarkMode
      ? '#8592a3'
      : '#7A8AA0';

  return (
    <>
      {/* Spacer so content doesn't hide behind the fixed bar */}
      <div className="h-16 md:hidden" />

      {/* More sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />
          <div
            className="glass absolute bottom-0 left-0 right-0 rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] animate-[soft-float_0s]"
            style={{ boxShadow: '0 -12px 40px rgba(0,0,0,0.18)' }}
          >
            <div
              className="mx-auto mb-4 h-1.5 w-10 rounded-full"
              style={{ background: 'var(--color-border)' }}
            />
            <div className="grid grid-cols-3 gap-3">
              {MORE.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className="glass-card flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4"
                    style={{
                      color: active ? 'var(--color-primary)' : 'var(--color-text)',
                      borderColor: active ? 'var(--color-primary)' : undefined,
                    }}
                  >
                    <item.Icon size={26} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Primary"
        className="glass-nav fixed bottom-0 left-0 right-0 z-50 border-t md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch">
          {PRIMARY.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200"
                style={{ color: itemColor(active) }}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
                <span className={`mb-0.5 leading-none transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  <item.Icon size={22} />
                </span>
                <span className={`text-[10px] font-bold tracking-wide ${active ? '' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More trigger */}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-label="More calculators"
            aria-expanded={moreOpen}
            className="relative flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200"
            style={{ color: itemColor(moreActive || moreOpen) }}
          >
            {(moreActive) && (
              <span
                className="absolute top-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full"
                style={{ background: 'var(--color-primary)' }}
              />
            )}
            <span className={`mb-0.5 leading-none transition-transform duration-200 ${moreOpen ? 'scale-110' : ''}`}>
              {moreOpen ? <IconClose size={22} /> : <IconMore size={22} />}
            </span>
            <span className="text-[10px] font-bold tracking-wide opacity-80">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
