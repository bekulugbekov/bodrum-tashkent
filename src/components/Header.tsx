import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGS = ['en', 'ru', 'uz'];

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Only on the home page (/) should the header be transparent when not scrolled
  const isHome = location.pathname === '/';
  // Use solid/dark background whenever: scrolled OR not on home page
  const solid = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.reservation'), path: '/reservation' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-400',
        solid
          ? 'bg-white shadow-sm py-3 border-b border-gray-100'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className={cn(
            'w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 ring-1',
            solid ? 'ring-bodrum-gold/40 shadow-sm' : 'ring-white/20'
          )}>
            <img
              src="/bodrum_logo.jpg"
              alt="Bodrum Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
          <span className={cn(
            'font-serif text-xl font-bold tracking-widest transition-colors duration-300',
            solid ? 'text-bodrum-navy' : 'text-white'
          )}>
            BODRUM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative text-sm font-medium tracking-wider uppercase transition-colors duration-200 py-1 group',
                  active
                    ? 'text-bodrum-gold'
                    : solid
                    ? 'text-bodrum-navy hover:text-bodrum-gold'
                    : 'text-white/90 hover:text-white'
                )}
              >
                {link.name}
                {/* Active indicator */}
                <span className={cn(
                  'absolute -bottom-0.5 left-0 h-[1px] bg-bodrum-gold transition-all duration-300',
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(v => !v)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-200',
                solid ? 'text-bodrum-navy hover:text-bodrum-gold' : 'text-white/80 hover:text-white'
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              {i18n.language.toUpperCase()}
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-20 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden"
                >
                  {LANGS.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                        i18n.language === lang
                          ? 'text-bodrum-gold bg-bodrum-gold/5'
                          : 'text-bodrum-navy hover:bg-gray-50'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/reservation"
            className="bg-bodrum-gold hover:bg-bodrum-gold-dark text-white px-5 py-2 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:shadow-md"
          >
            {t('hero.cta')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className={cn(
            'md:hidden p-1 transition-colors',
            solid ? 'text-bodrum-navy' : 'text-white'
          )}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'py-2.5 text-sm font-medium tracking-wider uppercase transition-colors border-b border-gray-50 last:border-0',
                    location.pathname === link.path
                      ? 'text-bodrum-gold'
                      : 'text-bodrum-navy hover:text-bodrum-gold'
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center justify-between pt-4 mt-2">
                <div className="flex gap-3">
                  {LANGS.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { changeLanguage(lang); setMobileMenuOpen(false); }}
                      className={cn(
                        'text-xs font-bold uppercase px-2 py-1 rounded transition-colors',
                        i18n.language === lang
                          ? 'text-white bg-bodrum-gold'
                          : 'text-bodrum-navy hover:text-bodrum-gold'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <Link
                  to="/reservation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-bodrum-gold text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
