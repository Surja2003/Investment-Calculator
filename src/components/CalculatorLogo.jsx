import logoMark from '../assets/logo-mark.png';

/**
 * Brand mark — the generated growth logo. Transparent PNG that reads on both
 * the pearl light theme and the deep-black dark theme.
 */
const CalculatorLogo = ({ className = '', size = '32' }) => {
  const dim = typeof size === 'number' ? `${size}px` : `${size}px`;
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoMark}
        alt="Investment Calculator logo"
        width={size}
        height={size}
        style={{ height: dim, width: 'auto', display: 'block' }}
        className="flex-shrink-0 select-none"
        draggable="false"
      />
    </div>
  );
};

export default CalculatorLogo;
