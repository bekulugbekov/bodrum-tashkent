import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Category = 'all' | 'food' | 'ambiance' | 'events';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: Exclude<Category, 'all'>;
  height: string;
}

const ITEMS: GalleryItem[] = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', alt: 'Mediterranean seafood platter',   category: 'food',     height: 'h-64' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt: 'Elegant dining room interior',  category: 'ambiance', height: 'h-80' },
  { id: 3,  src: 'https://images.unsplash.com/photo-1544025162-d76538485649?w=800&q=80', alt: 'Herb-crusted lamb chops',          category: 'food',     height: 'h-56' },
  { id: 4,  src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', alt: 'Private dining event setup',    category: 'events',   height: 'h-72' },
  { id: 5,  src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', alt: 'Curated wine selection',        category: 'ambiance', height: 'h-64' },
  { id: 6,  src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80', alt: 'Fresh Mediterranean grain bowl', category: 'food',     height: 'h-72' },
  { id: 7,  src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', alt: 'Restaurant interior at night',  category: 'ambiance', height: 'h-96' },
  { id: 8,  src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', alt: 'Anniversary celebration dinner', category: 'events',   height: 'h-60' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80', alt: 'Traditional mezze spread',        category: 'food',     height: 'h-64' },
  { id: 10, src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', alt: 'Candlelit table setting',         category: 'ambiance', height: 'h-56' },
  { id: 11, src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', alt: 'Corporate dinner event',       category: 'events',   height: 'h-80' },
  { id: 12, src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', alt: "Chef's signature plated dish", category: 'food',     height: 'h-64' },
];

export default function Gallery() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeCategory === 'all' ? ITEMS : ITEMS.filter(i => i.category === activeCategory);

  const handleFilter = (cat: Category) => {
    setActiveCategory(cat);
    setLightboxIdx(null);
  };

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback((len: number) => setLightboxIdx(i => (i !== null && i < len - 1 ? i + 1 : i)), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const len = filtered.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next(len);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, filtered.length, prev, next, closeLightbox]);

  const categories: { key: Category; label: string }[] = [
    { key: 'all',      label: t('gallery.filter.all') },
    { key: 'food',     label: t('gallery.filter.food') },
    { key: 'ambiance', label: t('gallery.filter.ambiance') },
    { key: 'events',   label: t('gallery.filter.events') },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-32 pb-16 bg-bodrum-navy text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-block text-bodrum-gold text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            {t('gallery.label')}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-white/55 max-w-lg mx-auto text-sm leading-relaxed">
            {t('gallery.subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 py-4 overflow-x-auto scrollbar-none">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilter(key)}
                className={cn(
                  'relative flex-shrink-0 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-200',
                  activeCategory === key
                    ? 'bg-bodrum-gold text-white shadow-sm'
                    : 'text-gray-500 hover:text-bodrum-navy hover:bg-gray-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          >
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-4 group relative overflow-hidden rounded-sm cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className={`w-full ${item.height} object-cover transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-bodrum-gold text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                    {categories.find(c => c.key === item.category)?.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="bg-bodrum-navy py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            {t('gallery.cta.title')}
          </h2>
          <p className="text-white/55 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            {t('gallery.cta.subtitle')}
          </p>
          <Link
            to="/reservation"
            className="inline-block bg-bodrum-gold hover:bg-bodrum-gold-dark text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            {t('gallery.cta.button')}
          </Link>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              disabled={lightboxIdx === 0}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 disabled:opacity-20 disabled:cursor-default"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(filtered.length); }}
              disabled={lightboxIdx === filtered.length - 1}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 disabled:opacity-20 disabled:cursor-default"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIdx].src.replace('w=800', 'w=1400')}
                alt={filtered[lightboxIdx].alt}
                className="w-full max-h-[80vh] object-contain rounded-sm"
              />
              <div className="mt-3 flex items-center justify-between px-1">
                <p className="text-white/60 text-sm">{filtered[lightboxIdx].alt}</p>
                <span className="text-white/35 text-xs tabular-nums">
                  {lightboxIdx + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
