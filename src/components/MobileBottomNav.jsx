import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const NAV = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/sip', icon: '📈', label: 'SIP' },
  { path: '/lumpsum', icon: '💰', label: 'Lumpsum' },
  { path: '/swp', icon: '🏦', label: 'SWP' },
  { path: '/goals', icon: '🎯', label: 'Goal' },
  { path: '/emi', icon: '🏠', label: 'EMI' },
  { path: '/compare', icon: '⚖️', label: 'Compare' },
];

const MobileBottomNav = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Mobile bottom nav should be visible across the app so users can navigate between calculators
  // calcPaths logic removed to fix 'calculators not opening / cannot switch' bug

  return (
    <>
      {/* Spacer so content doesn't hide behind nav */}
      <div className="h-16 md:hidden" />
      <nav
        aria-label="Mobile navigation"
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden border-t backdrop-blur-xl ${
          isDarkMode
            ? 'bg-[#090d16]/95 border-slate-800'
            : 'bg-white/95 border-slate-200'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch overflow-x-auto scrollbar-hide">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-shrink-0 px-3 py-2 min-w-[64px] transition-all duration-200 ${
                  active
                    ? isDarkMode
                      ? 'text-emerald-400'
                      : 'text-emerald-600'
                    : isDarkMode
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`text-lg leading-none mb-0.5 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-bold tracking-wide ${active ? '' : 'opacity-70'}`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
