import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="GitHub"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="WhatsApp"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'SIP Calculator', to: '/sip' },
  { label: 'Lumpsum', to: '/lumpsum' },
  { label: 'SWP', to: '/swp' },
  { label: 'Goal Planner', to: '/goal' },
  { label: 'EMI Calculator', to: '/emi' },
  { label: 'Compare', to: '/compare' },
  { label: 'Glossary', to: '/glossary' },
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0a0f0a 0%, #050a05 100%)'
          : 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)',
        borderTop: isDark ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(16,185,129,0.25)',
        color: isDark ? '#d1fae5' : '#064e3b',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Main Footer Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Column 1: Logo + Tagline + Dark Mode Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16,185,129,0.4)',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>₹</span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Investment Calculator
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: isDark ? '#6ee7b7' : '#065f46',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Plan smarter. Invest better. Retire richer.
          </p>

          {/* Dark mode description */}
          <p
            style={{
              fontSize: '0.8rem',
              lineHeight: '1.6',
              color: isDark ? '#4ade80' : '#047857',
              margin: 0,
              padding: '0.75rem 1rem',
              background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.12)',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(16,185,129,0.2)',
            }}
          >
            🌙 <strong>Dark mode enabled</strong> — easy on the eyes, built for late-night planning
            sessions. Toggle anytime using the switch in the header.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#10b981',
            }}
          >
            Quick Links
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  style={{
                    color: isDark ? '#a7f3d0' : '#065f46',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'color 0.2s ease, gap 0.2s ease',
                    paddingBottom: '1px',
                    borderBottom: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#10b981';
                    e.currentTarget.style.borderBottomColor = '#10b981';
                    e.currentTarget.style.gap = '0.6rem';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = isDark ? '#a7f3d0' : '#065f46';
                    e.currentTarget.style.borderBottomColor = 'transparent';
                    e.currentTarget.style.gap = '0.4rem';
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '0.65rem' }}>▶</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#10b981',
            }}
          >
            Resources
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* FAQ */}
            <Link
              to="/faq"
              style={{
                color: isDark ? '#a7f3d0' : '#065f46',
                textDecoration: 'none',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease',
                paddingBottom: '1px',
                borderBottom: '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#10b981';
                e.currentTarget.style.borderBottomColor = '#10b981';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = isDark ? '#a7f3d0' : '#065f46';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              <span style={{ color: '#10b981', fontSize: '0.65rem' }}>▶</span>
              FAQ
            </Link>

            {/* GitHub */}
            <a
              href="https://github.com/Surja2003/Investment-Calculator"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isDark ? '#a7f3d0' : '#065f46',
                textDecoration: 'none',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#10b981')}
              onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#a7f3d0' : '#065f46')}
            >
              <GitHubIcon />
              View on GitHub
            </a>

            {/* WhatsApp Community */}
            <a
              href="#whatsapp-community"
              style={{
                color: isDark ? '#a7f3d0' : '#065f46',
                textDecoration: 'none',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#25d366')}
              onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#a7f3d0' : '#065f46')}
              title="WhatsApp Community — Coming Soon"
            >
              <WhatsAppIcon />
              WhatsApp Community
              <span
                style={{
                  fontSize: '0.65rem',
                  background: 'linear-gradient(90deg,#10b981,#059669)',
                  color: '#fff',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Soon
              </span>
            </a>

            {/* Privacy Note */}
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.1)',
                border: isDark ? '1px solid rgba(16,185,129,0.12)' : '1px solid rgba(16,185,129,0.2)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                lineHeight: '1.6',
                color: isDark ? '#6ee7b7' : '#047857',
              }}
            >
              🔒 <strong>Privacy First</strong> — We don't collect, store, or share any personal
              data. All calculations happen locally in your browser.
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem 1.25rem',
        }}
      >
        <p
          style={{
            fontSize: '0.72rem',
            color: isDark ? '#374151' : '#9ca3af',
            textAlign: 'center',
            margin: 0,
            padding: '0.75rem 1rem',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
            borderRadius: '8px',
            border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          ⚠️ All calculations are for informational purposes only. Not SEBI registered advice.
          Consult a qualified financial advisor before making investment decisions.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)',
          margin: '0 1.5rem',
        }}
      />

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.78rem',
            color: isDark ? '#4b5563' : '#6b7280',
            lineHeight: '1.6',
          }}
        >
          © 2025 Investment Calculator. Built with{' '}
          <span style={{ color: '#ef4444', fontSize: '1rem' }}>❤️</span> for Indian investors.{' '}
          <span
            style={{
              color: isDark ? '#10b981' : '#059669',
              fontWeight: 600,
            }}
          >
            No data collected. No login required.
          </span>
        </p>
      </div>
    </footer>
  );
}
