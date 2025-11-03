import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { saveNewsletter, saveContact } from '../utils/storage';
// Removed blog/editor content for simplified home
import SimpleQuoteCards from '../components/SimpleQuoteCards';

const Home = () => {
  // minimal home

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
      {/* Hero Section */}
      <div className={
        isDarkMode
          ? "bg-gradient-to-r from-indigo-800 to-indigo-900 min-h-[100dvh] md:min-h-screen flex items-center"
          : "bg-gradient-to-r from-indigo-600 to-indigo-800 min-h-[100dvh] md:min-h-screen flex items-center"
      }>
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">Investment Calculator</h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 md:mb-8">Modern SIP, Lumpsum, and SWP tools for smart financial planning.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link to="/sip" className={
                isDarkMode
                  ? "px-5 py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition-colors shadow-lg border-2 border-indigo-400"
                  : "px-5 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg border-2 border-indigo-400"
              }>Try SIP Calculator</Link>
              <Link to="/lumpsum" className={
                isDarkMode
                  ? "px-5 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors shadow-lg border-2 border-indigo-400"
                  : "px-5 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors shadow-lg border-2 border-indigo-400"
              }>Try Lumpsum Calculator</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Newsletter + Contact with new .form-box styles */}
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-12">
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
                  onChange={(e)=>setNewsletterEmail(e.target.value)}
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
                <input
                  id="contact-name"
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e)=>setContactForm((p)=>({...p, name:e.target.value}))}
                  required
                />
                <label className="sr-only" htmlFor="contact-email">Your email</label>
                <input
                  id="contact-email"
                  type="email"
                  className="input"
                  placeholder="Your email"
                  value={contactForm.email}
                  onChange={(e)=>setContactForm((p)=>({...p, email:e.target.value}))}
                  required
                />
                <label className="sr-only" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="input"
                  placeholder="Message"
                  rows="4"
                  value={contactForm.message}
                  onChange={(e)=>setContactForm((p)=>({...p, message:e.target.value}))}
                  required
                ></textarea>
                <button className="button-primary">Send</button>
              </form>
              {contactStatus && <p className="mt-2 text-xs" style={{color:'var(--color-text-secondary)'}}>{contactStatus}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Market Snapshot moved to bottom */}
      <div className={isDarkMode ? "bg-gray-900" : "bg-white"}>
        <div className="container mx-auto px-4 py-10">
          <h2 className={isDarkMode ? "text-center text-lg font-semibold text-gray-100 mb-4" : "text-center text-lg font-semibold text-gray-900 mb-4"}>Market Snapshot</h2>
          <SimpleQuoteCards />
        </div>
      </div>
    </div>
  );
};

export default Home;