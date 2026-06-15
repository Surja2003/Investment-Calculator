import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { saveNewsletter, saveContact } from '../utils/storage';
import SimpleQuoteCards from '../components/SimpleQuoteCards';
import FAQSection from '../components/FAQSection';

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);

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

  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section — Emerald/Dark theme (matches app brand) ── */}
      <div className={
        isDarkMode
          ? "relative overflow-hidden bg-[#090d16] min-h-[88dvh] md:min-h-[78vh] flex items-center"
          : "relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 min-h-[88dvh] md:min-h-[78vh] flex items-center"
      }>
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-emerald-400/5 rounded-full blur-[60px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Free · No sign-up · SIP · Lumpsum · SWP · EMI · Goals
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight">
              Smart{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Investment
              </span>
              {' '}Calculator
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Plan SIP, Lumpsum, SWP, EMI & Goals with real-time projections, inflation adjustments and tax estimates. Built for India, works globally.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { to: '/sip', label: '📈 SIP Calculator', primary: true },
                { to: '/lumpsum', label: '💰 Lumpsum', primary: false },
                { to: '/emi', label: '🏠 EMI Calculator', primary: false },
                { to: '/goals', label: '🎯 Goal Planner', primary: false },
                { to: '/compare', label: '⚖️ Compare', primary: false },
              ].map((btn) => (
                <Link
                  key={btn.to}
                  to={btn.to}
                  className={
                    btn.primary
                      ? "px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/25 text-sm"
                      : "px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm text-sm"
                  }
                >
                  {btn.label}
                </Link>
              ))}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { icon: '📊', label: 'Year-by-Year Charts', desc: 'Visual projections' },
                { icon: '🧾', label: 'Tax Estimation', desc: 'LTCG & STCG' },
                { icon: '🌍', label: 'India & Global', desc: '₹ & $ modes' },
                { icon: '📤', label: 'Share Results', desc: 'WhatsApp & Link' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm"
                >
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xs font-bold text-white mb-0.5">{f.label}</div>
                  <div className="text-[10px] text-slate-400">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Market Ticker — RIGHT BELOW HERO ── */}
      <div className={isDarkMode ? "bg-[#0c1222] border-b border-slate-800" : "bg-white border-b border-slate-200"}>
        <div className="container mx-auto px-4 py-6">
          <div className={isDarkMode
            ? "max-w-6xl mx-auto rounded-2xl border border-slate-800 bg-[#090d16]/70 p-5"
            : "max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-5"
          }>
            <SimpleQuoteCards />
          </div>
        </div>
      </div>

      {/* ── FAQ Section ── */}
      <FAQSection />

      {/* ── Newsletter + Contact ── */}
      <div className={isDarkMode ? "bg-slate-950/40" : "bg-slate-50"}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto mb-8 text-center">
            <h2 className={isDarkMode ? "text-2xl md:text-3xl font-bold text-gray-100 mb-2" : "text-2xl md:text-3xl font-bold text-gray-900 mb-2"}>
              Stay connected
            </h2>
            <p className={isDarkMode ? "text-sm md:text-base text-gray-400" : "text-sm md:text-base text-gray-600"}>
              Get market insights and ask planning questions anytime.
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Newsletter */}
            <div className="form-box">
              <h3>Subscribe to Our Newsletter</h3>
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
              {newsletterStatus && <p className="mt-2 text-xs" style={{color:'var(--color-text-secondary)'}}>{newsletterStatus}</p>}
            </div>

            {/* Contact */}
            <div className="form-box">
              <h3>Contact Us</h3>
              <form onSubmit={onContactSubmit}>
                <label className="sr-only" htmlFor="contact-name">Your name</label>
                <input id="contact-name" type="text" className="input" placeholder="Your name"
                  value={contactForm.name} onChange={(e) => setContactForm((p) => ({...p, name:e.target.value}))} required />
                <label className="sr-only" htmlFor="contact-email">Your email</label>
                <input id="contact-email" type="email" className="input" placeholder="Your email"
                  value={contactForm.email} onChange={(e) => setContactForm((p) => ({...p, email:e.target.value}))} required />
                <label className="sr-only" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="input" placeholder="Message" rows="4"
                  value={contactForm.message} onChange={(e) => setContactForm((p) => ({...p, message:e.target.value}))} required />
                <button className="button-primary">Send</button>
              </form>
              {contactStatus && <p className="mt-2 text-xs" style={{color:'var(--color-text-secondary)'}}>{contactStatus}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
