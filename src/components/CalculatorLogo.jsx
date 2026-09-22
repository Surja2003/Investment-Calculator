/**
 * Brand mark — a rounded "coin/badge" carrying an upward growth curve.
 * Sober steel-blue → sage gradient, white chart. Scales cleanly at any size.
 */
const CalculatorLogo = ({ className = '', size = '32' }) => {
  const gid = 'brandGrad';
  return (
    <div className={`flex items-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0" role="img" aria-label="Investment Calculator logo">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B6098" />
            <stop offset="55%" stopColor="#3E7C86" />
            <stop offset="100%" stopColor="#4C9A82" />
          </linearGradient>
        </defs>

        {/* Badge */}
        <rect x="2" y="2" width="28" height="28" rx="8.5" fill={`url(#${gid})`} />
        {/* Top highlight for depth */}
        <rect x="2" y="2" width="28" height="28" rx="8.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" />
        <path d="M8.5 3.5h15a5 5 0 0 1 5 5v1.5c-4-2.6-10-3.6-14-2.6-3.3.8-7.4 1.2-9.9-.2a5 5 0 0 1 3.9-3.7Z" fill="#FFFFFF" fillOpacity="0.10" />

        {/* Growth area */}
        <path d="M7 22.5 12 17.5 16 19.5 20.5 13 25 9.5 25 24.5 7 24.5 Z" fill="#FFFFFF" fillOpacity="0.16" />
        {/* Growth line */}
        <path d="M7 22.5 12 17.5 16 19.5 20.5 13 25 9.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Node at the peak */}
        <circle cx="25" cy="9.5" r="1.8" fill="#FFFFFF" />
        <circle cx="12" cy="17.5" r="1.1" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>
    </div>
  );
};

export default CalculatorLogo;
