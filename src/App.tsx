import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring } from 'motion/react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Admin from './pages/Admin';
import About from './pages/About';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-bodrum-gold z-[60] pointer-events-none"
    />
  );
}

function TelegramCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <motion.a
      href="https://t.me/+998781507771"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
      style={{ background: '#2AABEE' }}
      aria-label="Contact via Telegram"
      title="Contact us on Telegram"
    >
      <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
      <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: '#2AABEE' }} />
    </motion.a>
  );
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return visible ? (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-bodrum-navy text-white flex items-center justify-center shadow-lg hover:bg-bodrum-gold transition-colors"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  ) : null;
}

function Footer() {
  const { t } = useTranslation();
  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.menu'), path: '/menu' },
    { label: t('nav.reservation'), path: '/reservation' },
    { label: t('nav.about'), path: '/about' },
  ];
  return (
    <footer className="bg-bodrum-navy text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <img src="/bodrum_logo.jpg" alt="Bodrum" className="w-12 h-12 rounded-full object-cover ring-1 ring-bodrum-gold/30" />
              <h3 className="font-serif text-3xl font-bold tracking-wider text-bodrum-gold">BODRUM</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{t('footer.tagline')}</p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/bodrum_restaurant_uz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-bodrum-gold flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://t.me/+998781507771" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-bodrum-gold flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="https://www.tripadvisor.com/Restaurant_Review-g293968-d23159556-Reviews-Bodrum_Family_Restaurant-Tashkent_Tashkent_Province.html" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor" className="w-9 h-9 rounded-full bg-white/10 hover:bg-bodrum-gold flex items-center justify-center transition-colors">
                <span className="text-xs font-bold">TA</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg mb-5">{t('footer.nav')}</h4>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 text-sm hover:text-bodrum-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-bodrum-gold mt-0.5 flex-shrink-0" />
                <span>Navoi avenue, 26, Tashkent<br /><span className="text-xs text-gray-600">Near Alisher Navoi metro</span></span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-bodrum-gold flex-shrink-0" />
                <a href="tel:+998781507771" className="hover:text-white transition-colors">+998 78 150 77 71</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-bodrum-gold flex-shrink-0" />
                <a href="mailto:info@bodrumtashkent.uz" className="hover:text-white transition-colors">info@bodrumtashkent.uz</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg mb-5">{t('footer.hours')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>{t('footer.weekdays')}</li>
              <li>{t('footer.friday')}</li>
              <li>{t('footer.sunday')}</li>
            </ul>
            <Link
              to="/reservation"
              className="mt-6 inline-block bg-bodrum-gold hover:bg-bodrum-gold-dark text-white px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <span>&copy; {new Date().getFullYear()} Bodrum Tashkent. {t('footer.rights')}</span>
          <span className="text-gray-600">Designed with care for Mediterranean dining</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <TelegramCTA />
      <BackToTopButton />
    </Router>
  );
}
