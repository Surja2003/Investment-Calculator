import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { saveNewsletter, saveContact } from '../utils/storage';
import SimpleQuoteCards from '../components/SimpleQuoteCards';
import FAQSection from '../components/FAQSection';
import Reveal from '../components/shared/Reveal';

const TRUST = [
  { icon: '📊', label: 'Year-by-year charts', desc: 'Clear visual projections' },
  { icon: '🧾', label: 'Tax estimation', desc: 'LTCG & STCG built in' },
  { icon: '🌍', label: 'India & global', desc: '₹ and $ modes' },
  { icon: '🔒', label: 'Private by design', desc: 'Runs in your browser' },
];

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);
  const { isDarkMode } = useTheme();

  const onNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('Saving...');
    const res = await saveNewsletter(newsletterEmail);
    setNewsletterStatus(res?.ok ? 'Subscribed!' : 'Failed. Try again');
    if (res?.ok) setNewsletterEmail('');
  };

  const onContactSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    if (!name || !email || !message) return;
    setContactStatus('Saving...');
    const res = await saveContact(contactForm);
    setContactStatus(res?.ok ? 'Sent!' : 'Failed. Try again');
    if (res?.ok) setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="w-full">
      {/* ── Hero — contained glass card, sober & trustworthy ── */}
      <Reveal className="mx-auto max-w-6xl px-1 pt-2 sm:pt-4">
        <section
          className="glass-card relative overflow-hidden rounded-3xl px-5 py-12 text-center sm:px-10 sm:py-16"
          style={{
            background: isDarkMode
              ? 'linear-gradient(160deg, #16202E 0%, #131C29 55%, #101826 100%)'
              : 'linear-gradient(160deg, #FFFFFF 0%, #F1F5FB 55%, #EAF0F8 100%)',
          }}
        >
          {/* contained soft glows */}
          <span className="brand-glow" style={{ top: '-15%', left: '5%', width: 320, height: 320, background: 'rgba(59,96,152,0.28)' }} />
          <span className="brand-glow" style={{ bottom: '-20%', right: '0%', width: 280, height: 280, background: 'rgba(76,154,130,0.20)' }} />

          <div className="relative z-10 mx-auto max-w-3xl">
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold sm:text-sm"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--glass-bg)',
                color: 'var(--color-primary)',
              }}
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--color-secondary)' }} />
              Free · No sign-up · Private
            </span>

            <h1
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
              style={{ color: 'var(--color-text)' }}
            >
              Plan your money with{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
              >
                confidence
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              SIP, Lumpsum, SWP, EMI and Goal planning with real-time projections,
              inflation adjustments and tax estimates. Built for India, works globally.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/sip"
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--color-primary)', boxShadow: '0 10px 24px rgba(59,96,152,0.28)' }}
              >
                Start planning
              </Link>
              <Link
                to="/compare"
                className="glass rounded-xl px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                style={{ color: 'var(--color-text)' }}
              >
                Compare tools
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Trust / feature strip ── */}
      <div className="mx-auto max-w-6xl px-1 py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRUST.map((f, i) => (
            <Reveal key={f.label} delay={i * 70}>
              <div className="glass-card h-full rounded-2xl p-4 text-center">
                <div className="mb-1 text-2xl">{f.icon}</div>
                <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{f.label}</div>
                <div className="mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Market snapshot ── */}
      <div className="mx-auto max-w-6xl px-1 pb-6">
        <Reveal>
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <SimpleQuoteCards />
          </div>
        </Reveal>
      </div>

      {/* ── FAQ ── */}
      <Reveal className="mx-auto max-w-6xl px-1">
        <FAQSection />
      </Reveal>

      {/* ── Newsletter + Contact ── */}
      <div className="mx-auto max-w-6xl px-1 py-12">
        <Reveal className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl" style={{ color: 'var(--color-text)' }}>
            Stay connected
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'var(--color-text-secondary)' }}>
            Get market insights and ask planning questions anytime.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <Reveal>
            <div className="form-box">
              <h3>Subscribe to our newsletter</h3>
              <form onSubmit={onNewsletterSubmit}>
                <label className="sr-only" htmlFor="newsletter-email">Enter your email</label>
                <input
                  id="newsletter-email"
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="button-primary">Subscribe</button>
              </form>
              {newsletterStatus && <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{newsletterStatus}</p>}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="form-box">
              <h3>Contact us</h3>
              <form onSubmit={onContactSubmit}>
                <label className="sr-only" htmlFor="contact-name">Your name</label>
                <input id="contact-name" type="text" className="input" placeholder="Your name"
                  value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} required />
                <label className="sr-only" htmlFor="contact-email">Your email</label>
                <input id="contact-email" type="email" className="input" placeholder="Your email"
                  value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} required />
                <label className="sr-only" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="input" placeholder="Message" rows="4"
                  value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} required />
                <button className="button-primary">Send</button>
              </form>
              {contactStatus && <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{contactStatus}</p>}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Home;
