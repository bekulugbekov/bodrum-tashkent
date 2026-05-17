import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Wine, Sparkles, Users, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Gallery images ─────────────────────────────────────────────── */
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop&q=80', alt: 'Elegant Dining Area',      span: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',  alt: 'Modern Ambiance',            span: '' },
  { src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&auto=format&fit=crop&q=80',  alt: 'Plated Mediterranean Dish',  span: '' },
  { src: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&auto=format&fit=crop&q=80', alt: 'Wine Glasses',              span: '' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80', alt: 'Signature Gourmet Dish',   span: '' },
  { src: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?w=900&auto=format&fit=crop&q=80',  alt: 'Bar & Cocktails',            span: '' },
];

/* ─── Stats ──────────────────────────────────────────────────────── */
interface StatDef { numeric: number; suffix: string; labelKey: string; }
const STATS: StatDef[] = [
  { numeric: 17,  suffix: '+',  labelKey: 'home.stats.years'  },
  { numeric: 200, suffix: '+',  labelKey: 'home.stats.dishes' },
  { numeric: 15,  suffix: 'K+', labelKey: 'home.stats.guests' },
  { numeric: 4,   suffix: '.9', labelKey: 'home.stats.rating' },
];

/* ─── Reviews data ───────────────────────────────────────────────── */
interface ReviewDef {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  textKey: string;
}
const REVIEWS: ReviewDef[] = [
  { name: 'Alisher T.', location: 'Tashkent',     avatar: 'AT', rating: 5, textKey: 'home.reviews.r1.text' },
  { name: 'Elena P.',   location: 'Moscow',        avatar: 'EP', rating: 5, textKey: 'home.reviews.r2.text' },
  { name: 'James K.',   location: 'London',        avatar: 'JK', rating: 5, textKey: 'home.reviews.r3.text' },
  { name: 'Sardor M.', location: 'Tashkent',      avatar: 'SM', rating: 5, textKey: 'home.reviews.r4.text' },
  { name: 'Natalya V.', location: 'St. Petersburg', avatar: 'NV', rating: 5, textKey: 'home.reviews.r5.text' },
  { name: 'Ahmed K.',  location: 'Dubai',          avatar: 'AK', rating: 5, textKey: 'home.reviews.r6.text' },
];

const featureIcons = [UtensilsCrossed, Sparkles, Wine, Users];
const GAP = 24; // gap-6

/* ─── Hooks ──────────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, duration = 1200): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setCount(target);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);
  return count;
}

/* ─── Sub-components ─────────────────────────────────────────────── */
function StatItem({ stat, inView }: { stat: StatDef; inView: boolean }) {
  const { t } = useTranslation();
  const count = useCountUp(stat.numeric, inView);
  return (
    <div className="text-center">
      <p className="font-serif text-3xl text-bodrum-gold font-bold">{count}{stat.suffix}</p>
      <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{t(stat.labelKey)}</p>
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewDef }) {
  const { t } = useTranslation();
  return (
    <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-bodrum-gold/20 transition-all duration-400 p-7 flex flex-col">
      {/* Gold quote mark */}
      <span className="font-serif text-5xl text-bodrum-gold/20 leading-none select-none mb-1">"</span>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: review.rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-bodrum-gold text-bodrum-gold" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
        {t(review.textKey)}
      </p>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-bodrum-gold/20 to-transparent my-5" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bodrum-navy flex items-center justify-center text-white text-[11px] font-bold tracking-wide flex-shrink-0">
          {review.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-bodrum-navy text-sm font-semibold truncate">{review.name}</p>
          <p className="text-gray-400 text-xs truncate">{review.location}</p>
        </div>
        <span className="ml-auto flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-bodrum-gold bg-bodrum-gold/5 px-2.5 py-1 rounded-full border border-bodrum-gold/20">
          {t('home.reviews.verified')}
        </span>
      </div>
    </div>
  );
}

function ReviewCarousel({ reviews }: { reviews: ReviewDef[] }) {
  const { t } = useTranslation();
  const [current, setCurrent]     = useState(0);
  const [isPaused, setIsPaused]   = useState(false);
  const [slideW, setSlideW]       = useState(0);
  const [perView, setPerView]     = useState(3);
  const containerRef              = useRef<HTMLDivElement>(null);

  /* Measure card width before first paint */
  const measure = useCallback(() => {
    const vp = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    setPerView(vp);
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      const cardW = (w - GAP * (vp - 1)) / vp;
      setSlideW(cardW + GAP); // distance to advance by 1 card
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const maxIdx = Math.max(0, reviews.length - perView);

  const go = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(maxIdx, idx)));
    setIsPaused(true);
  }, [maxIdx]);

  /* Resume auto-play after 6 s of no interaction */
  useEffect(() => {
    if (!isPaused) return;
    const t = setTimeout(() => setIsPaused(false), 6000);
    return () => clearTimeout(t);
  }, [isPaused, current]);

  /* Auto-advance */
  useEffect(() => {
    if (isPaused || slideW === 0) return;
    const t = setInterval(() => {
      setCurrent(c => (c >= maxIdx ? 0 : c + 1));
    }, 4500);
    return () => clearInterval(t);
  }, [isPaused, maxIdx, slideW]);

  const translateX = slideW > 0 ? -(current * slideW) : 0;
  const cardW      = Math.max(0, slideW - GAP);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.9 }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={cardW ? { width: cardW } : undefined}
            >
              <ReviewCard review={r} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-10">
        {/* Prev */}
        <motion.button
          onClick={() => go(current - 1)}
          disabled={current === 0}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-bodrum-navy hover:bg-bodrum-navy hover:text-white hover:border-bodrum-navy transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === current
                  ? 'w-8 bg-bodrum-gold'
                  : 'w-2 bg-gray-300 hover:bg-bodrum-gold/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          onClick={() => go(current + 1)}
          disabled={current >= maxIdx}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-bodrum-navy hover:bg-bodrum-navy hover:text-white hover:border-bodrum-navy transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Next reviews"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress bar (auto-play indicator) */}
      <div className="mt-5 max-w-xs mx-auto h-px bg-gray-200 rounded-full overflow-hidden">
        {!isPaused && (
          <motion.div
            key={current}
            className="h-full bg-bodrum-gold rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.5, ease: 'linear' }}
          />
        )}
      </div>

      {/* Slide label */}
      <p className="text-center text-gray-400 text-xs mt-3 tracking-widest uppercase">
        {current + 1} / {maxIdx + 1}
      </p>
    </div>
  );
}

function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: typeof galleryImages;
  index: number;
  onClose: () => void;
  onPrev:  () => void;
  onNext:  () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-5 left-5 text-white/60 text-sm font-medium">{index + 1} / {images.length}</div>
      <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-bodrum-gold flex items-center justify-center text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index].src.replace('w=900', 'w=1600').replace('w=1400', 'w=1800')}
          alt={images[index].alt}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="max-w-[88vw] max-h-[85vh] object-contain rounded-sm shadow-2xl"
          onClick={e => e.stopPropagation()}
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-bodrum-gold flex items-center justify-center text-white transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wide">{images[index].alt}</div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();
  const heroRef  = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView,   setStatsInView]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsInView(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : 0), []);
  const nextImage = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % galleryImages.length : 0), []);

  const features = [
    { icon: featureIcons[0], titleKey: 'home.features.cuisine.title', descKey: 'home.features.cuisine.desc' },
    { icon: featureIcons[1], titleKey: 'home.features.ambiance.title', descKey: 'home.features.ambiance.desc' },
    { icon: featureIcons[2], titleKey: 'home.features.wine.title', descKey: 'home.features.wine.desc' },
    { icon: featureIcons[3], titleKey: 'home.features.service.title', descKey: 'home.features.service.desc' },
  ];

  return (
    <div className="min-h-screen bg-bodrum-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 scale-110">
          <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2000&auto=format&fit=crop&q=80"
            alt="Bodrum Restaurant" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-bodrum-navy/75 via-bodrum-navy/50 to-bodrum-navy/85" />
        </motion.div>
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x:[0,40,0], y:[0,-30,0], opacity:[0.08,0.15,0.08] }}
            transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-bodrum-gold blur-3xl" />
          <motion.div animate={{ x:[0,-30,0], y:[0,40,0], opacity:[0.06,0.12,0.06] }}
            transition={{ duration:15, repeat:Infinity, ease:'easeInOut', delay:3 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-bodrum-gold blur-3xl" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}
            className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-bodrum-gold" />
            <p className="text-bodrum-gold uppercase tracking-[0.35em] text-xs font-semibold">Tashkent · Mediterranean</p>
            <span className="h-px w-10 bg-bodrum-gold" />
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9, delay:0.15, ease:[0.16,1,0.3,1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.05]">
            {t('hero.title')}
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }}
            className="text-lg md:text-xl text-white/75 mb-10 font-light max-w-xl mx-auto tracking-wide">
            {t('hero.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservation"
              className="group relative inline-flex items-center justify-center overflow-hidden bg-bodrum-gold px-10 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]">
              <span className="relative z-10">{t('hero.cta')}</span>
              <span className="absolute inset-0 bg-bodrum-gold-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
            <Link to="/menu"
              className="inline-flex items-center justify-center border border-white/40 hover:border-white/80 text-white px-10 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
              {t('nav.menu')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.button onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors">
          <motion.div animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:2 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-bodrum-navy py-10">
        <div ref={statsRef} className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i * 0.08 }}>
              <StatItem stat={stat} inView={statsInView} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── About Preview ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-bodrum-gold" />
              <p className="text-bodrum-gold uppercase tracking-widest text-xs font-semibold">Est. 2008</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-bodrum-navy mb-6 leading-tight">{t('home.about.title')}</h2>
            <p className="text-gray-500 leading-relaxed mb-5 text-[15px]">{t('home.about.p1')}</p>
            <p className="text-gray-500 leading-relaxed mb-10 text-[15px]">{t('home.about.p2')}</p>
            <Link to="/about" className="inline-flex items-center gap-2 text-bodrum-gold font-semibold uppercase tracking-widest text-xs hover:gap-4 transition-all duration-300 group">
              {t('home.about.link')}
              <span className="text-base leading-none transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
            className="relative">
            <div className="relative h-[540px] rounded-sm overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&auto=format&fit=crop&q=80"
                alt="Mediterranean cuisine" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-bodrum-navy/40 to-transparent" />
            </div>
            <motion.div initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ delay:0.3, type:'spring', stiffness:200 }}
              className="absolute -bottom-6 -left-6 bg-bodrum-gold text-white p-5 rounded-sm shadow-xl">
              <p className="font-serif text-4xl font-bold leading-none">17+</p>
              <p className="text-[10px] uppercase tracking-widest text-white/80 mt-1.5">Years of<br />Excellence</p>
            </motion.div>
            <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-bodrum-gold/20 rounded-sm -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 relative overflow-hidden" style={{ background:'linear-gradient(135deg,#002347 0%,#001e3c 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage:`repeating-linear-gradient(45deg,#C5A059 0,#C5A059 1px,transparent 0,transparent 50%)`,
          backgroundSize:'24px 24px'
        }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-bodrum-gold/50" />
              <p className="text-bodrum-gold/70 uppercase tracking-widest text-xs font-semibold">Why Bodrum</p>
              <span className="h-px w-8 bg-bodrum-gold/50" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t('home.features.title')}</h2>
            <p className="text-white/40 text-sm mt-3">{t('home.features.subtitle')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div key={titleKey} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.5, delay: i * 0.1 }} whileHover={{ y:-4 }}
                className="group text-center p-6 rounded-sm border border-white/5 hover:border-bodrum-gold/30 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-bodrum-gold/10 group-hover:bg-bodrum-gold/20 flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-bodrum-gold" />
                </div>
                <h3 className="font-serif text-lg text-white mb-3">{t(titleKey)}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery with Lightbox ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl text-bodrum-navy mb-4">{t('home.gallery.title')}</h2>
            <div className="w-12 h-[2px] bg-bodrum-gold mx-auto mb-3" />
            <p className="text-gray-400 text-xs uppercase tracking-widest">Click to enlarge</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {galleryImages.map((img, i) => (
              <motion.div key={i} initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }} transition={{ duration:0.5, delay: i * 0.07 }}
                className={cn('relative overflow-hidden rounded-sm group cursor-zoom-in', img.span)}
                onClick={() => openLightbox(i)}>
                <img src={img.src} alt={img.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-bodrum-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                  <p className="text-white text-sm font-medium translate-y-3 group-hover:translate-y-0 transition-transform duration-300 tracking-wide">{img.alt}</p>
                </div>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-bodrum-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-bodrum-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={galleryImages} index={lightboxIndex}
            onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
        )}
      </AnimatePresence>

      {/* ── Testimonials Carousel ── */}
      <section className="py-28 bg-bodrum-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-bodrum-gold" />
              <p className="text-bodrum-gold uppercase tracking-[0.3em] text-xs font-semibold">
                {t('home.reviews.label')}
              </p>
              <span className="h-px w-8 bg-bodrum-gold" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-bodrum-navy">
              {t('home.reviews.title')}
            </h2>
          </motion.div>

          <ReviewCarousel reviews={REVIEWS} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=2000&auto=format&fit=crop&q=80"
            alt="Bodrum atmosphere" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-bodrum-navy/80" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-10 bg-bodrum-gold" />
              <p className="text-bodrum-gold uppercase tracking-widest text-xs font-semibold">Reserve Now</p>
              <span className="h-px w-10 bg-bodrum-gold" />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-tight">{t('home.cta.title')}</h2>
            <p className="text-white/60 text-lg mb-10 font-light">{t('home.cta.subtitle')}</p>
            <Link to="/reservation"
              className="group relative inline-flex items-center justify-center overflow-hidden bg-bodrum-gold px-12 py-5 rounded-sm text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(197,160,89,0.5)]">
              <span className="relative z-10">{t('home.cta.button')}</span>
              <span className="absolute inset-0 bg-bodrum-gold-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
