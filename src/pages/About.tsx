import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Award, Leaf, Star, Heart } from 'lucide-react';

const VALUES = [
  { icon: Leaf,  titleKey: 'about.values.quality.title',      descKey: 'about.values.quality.desc' },
  { icon: Star,  titleKey: 'about.values.authenticity.title', descKey: 'about.values.authenticity.desc' },
  { icon: Heart, titleKey: 'about.values.hospitality.title',  descKey: 'about.values.hospitality.desc' },
];

const TEAM = [
  { image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80', nameKey: 'about.team.chef.name', roleKey: 'about.team.chef.role', bioKey: 'about.team.chef.bio' },
  { image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80', nameKey: 'about.team.sommelier.name', roleKey: 'about.team.sommelier.role', bioKey: 'about.team.sommelier.bio' },
  { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', nameKey: 'about.team.manager.name', roleKey: 'about.team.manager.role', bioKey: 'about.team.manager.bio' },
];

const AWARDS = ['about.awards.1', 'about.awards.2', 'about.awards.3'];

export default function About() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);

  return (
    <div className="min-h-screen bg-bodrum-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110 z-0">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=2000&auto=format&fit=crop&q=80"
            alt="About Bodrum"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bodrum-navy/55 via-bodrum-navy/45 to-bodrum-navy/80" />
        </motion.div>
        <div className="relative z-10 text-center px-6 mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-bodrum-gold" />
            <p className="text-bodrum-gold uppercase tracking-[0.35em] text-xs font-semibold">{t('about.subtitle')}</p>
            <span className="h-px w-8 bg-bodrum-gold" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-white">
            {t('about.title')}
          </motion.h1>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-bodrum-gold" />
              <p className="text-bodrum-gold uppercase tracking-widest text-xs font-semibold">Since 2019</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-bodrum-navy mb-8 leading-tight">
              {t('about.story.title')}
            </h2>
            <div className="space-y-5 text-gray-500 text-[15px] leading-relaxed">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
          </motion.div>

          {/* ── Creative Image Collage ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[520px] select-none"
          >
            {/* Gold frame decoration top-left */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-bodrum-gold/60 z-10 pointer-events-none" />

            {/* Main large image — left-center, slightly taller */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="absolute top-6 left-0 w-[58%] h-[82%] overflow-hidden rounded-sm shadow-2xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80"
                alt="Signature dish"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bodrum-navy/30 to-transparent" />
            </motion.div>

            {/* Top-right image — overlapping the main */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="absolute top-0 right-0 w-[44%] h-[46%] overflow-hidden rounded-sm shadow-xl border-4 border-white group"
            >
              <img
                src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&auto=format&fit=crop&q=80"
                alt="Wine selection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>

            {/* Bottom-right image — slightly overlapping the main */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="absolute bottom-0 right-0 w-[44%] h-[46%] overflow-hidden rounded-sm shadow-xl border-4 border-white group"
            >
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                alt="Restaurant interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>

            {/* Gold quote badge — overlaps bottom of main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 180 }}
              className="absolute bottom-8 left-4 z-20 bg-bodrum-navy text-white px-5 py-4 rounded-sm shadow-xl max-w-[54%]"
            >
              <p className="text-bodrum-gold text-2xl font-serif leading-none mb-1">"</p>
              <p className="text-xs text-white/80 leading-relaxed italic">True Mediterranean taste, here in Tashkent.</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-px w-4 bg-bodrum-gold" />
                <p className="text-bodrum-gold text-[10px] uppercase tracking-widest font-semibold">Bodrum, 2019</p>
              </div>
            </motion.div>

            {/* Gold frame decoration bottom-right */}
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-bodrum-gold/60 z-10 pointer-events-none" />

            {/* Floating year badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute top-0 left-[54%] -translate-x-1/2 z-20 w-14 h-14 rounded-full bg-bodrum-gold shadow-lg flex flex-col items-center justify-center text-white"
            >
              <span className="font-serif text-lg font-bold leading-none">6+</span>
              <span className="text-[8px] uppercase tracking-wide leading-none mt-0.5 text-white/80">yrs</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#002347 0%,#001e3c 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(45deg,#C5A059 0,#C5A059 1px,transparent 0,transparent 50%)`, backgroundSize: '24px 24px' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">{t('about.values.title')}</h2>
            <div className="w-10 h-[2px] bg-bodrum-gold mx-auto" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div key={titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }} whileHover={{ y: -4 }}
                className="text-center p-8 rounded-sm border border-white/5 hover:border-bodrum-gold/30 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-bodrum-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-6 h-6 text-bodrum-gold" />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{t(titleKey)}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-bodrum-navy mb-4">{t('about.team.title')}</h2>
            <div className="w-10 h-[2px] bg-bodrum-gold mx-auto" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {TEAM.map((m, i) => (
              <motion.div key={m.nameKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="group">
                <div className="relative overflow-hidden rounded-sm shadow-md aspect-[3/4] mb-6">
                  <img src={m.image} alt={t(m.nameKey)} loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bodrum-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>
                <h3 className="font-serif text-xl text-bodrum-navy mb-1">{t(m.nameKey)}</h3>
                <p className="text-bodrum-gold text-xs font-bold uppercase tracking-widest mb-3">{t(m.roleKey)}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{t(m.bioKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-serif text-4xl text-bodrum-navy mb-4">{t('about.awards.title')}</h2>
            <div className="w-10 h-[2px] bg-bodrum-gold mx-auto" />
          </motion.div>
          <div className="space-y-4">
            {AWARDS.map((key, i) => (
              <motion.div key={key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-bodrum-white border border-gray-100 px-6 py-5 rounded-sm shadow-sm hover:shadow-md hover:border-bodrum-gold/20 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-full bg-bodrum-gold/10 group-hover:bg-bodrum-gold/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Award className="w-4 h-4 text-bodrum-gold" />
                </div>
                <p className="text-gray-700 text-sm">{t(key)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&auto=format&fit=crop&q=80"
            alt="Reserve" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-bodrum-navy/75" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-bodrum-gold" />
            <p className="text-bodrum-gold text-xs uppercase tracking-[0.3em] font-semibold">Reserve Now</p>
            <span className="h-px w-8 bg-bodrum-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">{t('home.cta.title')}</h2>
          <p className="text-white/60 mb-10 font-light">{t('home.cta.subtitle')}</p>
          <Link to="/reservation"
            className="group relative inline-flex items-center justify-center overflow-hidden bg-bodrum-gold px-12 py-5 rounded-sm text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(197,160,89,0.5)]">
            <span className="relative z-10">{t('home.cta.button')}</span>
            <span className="absolute inset-0 bg-bodrum-gold-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
