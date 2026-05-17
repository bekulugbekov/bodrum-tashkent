import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bodrum-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Decorative plate illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10 mx-auto w-40 h-40"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-bodrum-gold/30" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border border-bodrum-gold/20" />
          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="font-serif text-5xl text-bodrum-gold/40 select-none"
            >
              404
            </motion.span>
          </div>
          {/* Gold dot accent */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-bodrum-gold" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-bodrum-gold" />
            <p className="text-bodrum-gold text-xs uppercase tracking-widest font-semibold">Page Not Found</p>
            <span className="h-px w-8 bg-bodrum-gold" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-bodrum-navy mb-4">
            This table doesn't exist
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            The page you're looking for seems to have left the menu. Let us guide you back to something delicious.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center overflow-hidden bg-bodrum-navy text-white px-8 py-3.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg"
            >
              <span className="relative z-10">Back to Home</span>
              <span className="absolute inset-0 bg-bodrum-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center justify-center border border-bodrum-gold/40 text-bodrum-gold hover:border-bodrum-gold hover:bg-bodrum-gold/5 px-8 py-3.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
