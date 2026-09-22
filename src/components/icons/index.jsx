/**
 * Cohesive line-icon set (Lucide-style): 24x24 grid, no fill, currentColor
 * stroke, 1.75 width, round caps/joins. Consistent, professional, theme-aware.
 */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ size = 24, children, ...rest }) => (
  <svg {...base} width={size} height={size} aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Svg>
);

export const IconTrendingUp = (p) => (
  <Svg {...p}>
    <path d="M3 16.5 9 10l4 4 8-8" />
    <path d="M15 6h6v6" />
  </Svg>
);

export const IconWallet = (p) => (
  <Svg {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v1.5" />
    <path d="M3 7.5V18a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3" />
    <path d="M20.5 11H16a2.5 2.5 0 0 0 0 5h4.5a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Z" />
  </Svg>
);

export const IconBank = (p) => (
  <Svg {...p}>
    <path d="M3 9.5 12 4l9 5.5" />
    <path d="M4 9.5h16" />
    <path d="M6 10v7M10 10v7M14 10v7M18 10v7" />
    <path d="M3.5 20.5h17" />
  </Svg>
);

export const IconTarget = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconScale = (p) => (
  <Svg {...p}>
    <path d="M12 4v16" />
    <path d="M6 20h12" />
    <path d="M4.5 7.5 12 6l7.5 1.5" />
    <path d="M4.5 7.5 2.5 13a3 3 0 0 0 6 0L6.5 7" />
    <path d="M19.5 7.5 17.5 13a3 3 0 0 0 6 0L21.5 7" transform="translate(-2 0)" />
  </Svg>
);

export const IconCalculator = (p) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" />
    <path d="M8 7h8" />
    <path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14h.01M12 14h.01M8.5 17h.01M12 17h.01" />
    <path d="M15.5 14v3.5" />
  </Svg>
);

export const IconBook = (p) => (
  <Svg {...p}>
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2Z" />
    <path d="M4 19.5A2 2 0 0 1 6 18h14" />
    <path d="M8 7.5h7M8 10.5h5" />
  </Svg>
);

export const IconBarChart = (p) => (
  <Svg {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <rect x="7" y="12" width="3" height="5" rx="0.8" fill="currentColor" stroke="none" />
    <rect x="12" y="9" width="3" height="8" rx="0.8" fill="currentColor" stroke="none" />
    <rect x="17" y="6" width="3" height="11" rx="0.8" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconReceipt = (p) => (
  <Svg {...p}>
    <path d="M5 3.5v17l2-1.3 2 1.3 2-1.3 2 1.3 2-1.3 2 1.3v-17a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1Z" />
    <path d="M8.5 8h7M8.5 12h7" />
  </Svg>
);

export const IconGlobe = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z" />
  </Svg>
);

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.4 7 8.9 4.1-1.5 7-4.6 7-8.9V6l-7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const IconMore = (p) => (
  <Svg {...p}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
