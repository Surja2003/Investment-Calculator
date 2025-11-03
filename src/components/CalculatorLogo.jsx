const CalculatorLogo = ({ className = "", size = "32" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#4F46E5", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#10B981", stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Calculator Body */}
        <rect x="4" y="4" width="24" height="24" rx="4" ry="4" fill="url(#logo-grad)" />
        
        {/* Screen */}
        <rect x="6" y="6" width="20" height="6" rx="1" ry="1" fill="white" fillOpacity="0.9" />
        
        {/* Display Text */}
        <text 
          x="16" 
          y="10.5" 
          fontFamily="Arial, sans-serif" 
          fontSize="3" 
          textAnchor="middle" 
          fill="#4F46E5" 
          fontWeight="bold"
        >
          SIP
        </text>
        
        {/* Calculator Buttons */}
        <circle cx="9" cy="16" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="13" cy="16" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="17" cy="16" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="21" cy="16" r="1.5" fill="white" fillOpacity="0.8" />
        
        <circle cx="9" cy="20" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="13" cy="20" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="17" cy="20" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="21" cy="20" r="1.5" fill="white" fillOpacity="0.8" />
        
        <circle cx="9" cy="24" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="13" cy="24" r="1.5" fill="white" fillOpacity="0.8" />
        <rect x="16" y="22" width="6" height="3" rx="1.5" ry="1.5" fill="white" fillOpacity="0.9" />
        
        {/* Growth Arrow */}
        <path d="M23 14 L25 12 L27 14 M25 12 L25 18" stroke="white" strokeWidth="1.5" fill="none" fillOpacity="0.7" />
      </svg>
    </div>
  );
};

export default CalculatorLogo;