import React, { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Calendar, Clock, Users, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { saveReservation } from '@/lib/reservations';

const TIME_SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

interface Field { name: string; label: string; type?: string; placeholder: string; icon: React.ComponentType<{ className?: string }>; required?: boolean; }

export default function Reservation() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ date: '', time: '', guests: '2', name: '', email: '', phone: '', special: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    await new Promise(r => setTimeout(r, 1400));
    saveReservation({ ...formData });
    setStatus('success');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const reset = () => {
    setFormData({ date: '', time: '', guests: '2', name: '', email: '', phone: '', special: '' });
    setStatus('idle');
  };

  const inputCls = (name: string) =>
    `w-full bg-white/70 border rounded-sm px-4 py-3 text-sm text-bodrum-navy placeholder:text-gray-300 focus:outline-none transition-all duration-200 ${
      focused === name ? 'border-bodrum-gold ring-1 ring-bodrum-gold/30 bg-white' : 'border-gray-200 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-bodrum-white">

      {/* Page Banner */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&auto=format&fit=crop&q=80"
          alt="Reserve a table"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bodrum-navy/70 to-bodrum-navy/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-14">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-bodrum-gold text-xs uppercase tracking-[0.35em] mb-2 font-semibold">
            Bodrum Tashkent
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-white">
            {t('reservation.title')}
          </motion.h1>
        </div>
      </div>

      {/* Form area */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* ── Left: info panel ── */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quote card */}
            <div className="relative rounded-xl overflow-hidden h-56">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80"
                alt="Dining"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-bodrum-navy/65" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-6 h-px bg-bodrum-gold mb-4" />
                <p className="font-serif text-white text-lg italic leading-snug">
                  {t('reservation.quote')}
                </p>
                <div className="w-6 h-px bg-bodrum-gold mt-4" />
              </div>
            </div>

            {/* Info cards */}
            {[
              { icon: Clock, title: 'Hours', lines: [t('footer.weekdays'), t('footer.friday'), t('footer.sunday')] },
              { icon: Phone, title: t('footer.contact'), lines: ['Navoi avenue, 26, Tashkent', '+998 78 150 77 71', 'info@bodrumtashkent.uz'] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-bodrum-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-bodrum-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-bodrum-navy mb-1.5">{title}</p>
                  {lines.map(l => <p key={l} className="text-gray-500 text-xs leading-relaxed">{l}</p>)}
                </div>
              </div>
            ))}
          </motion.aside>

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="h-1.5 bg-gradient-to-r from-bodrum-gold via-bodrum-gold-light to-bodrum-gold" />

            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
                    </motion.div>
                    <h3 className="font-serif text-2xl text-bodrum-navy mb-3">{t('reservation.success.title')}</h3>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">{t('reservation.success.desc')}</p>
                    <button
                      onClick={reset}
                      className="text-xs font-bold uppercase tracking-widest text-bodrum-gold hover:text-bodrum-gold-dark transition-colors border-b border-bodrum-gold/40 pb-0.5"
                    >
                      {t('reservation.success.another')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <h2 className="font-serif text-2xl text-bodrum-navy mb-6">{t('reservation.title')}</h2>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {t('reservation.date')}
                        </label>
                        <input
                          type="date" name="date" required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date} onChange={handleChange}
                          onFocus={() => setFocused('date')} onBlur={() => setFocused(null)}
                          className={inputCls('date')}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {t('reservation.time')}
                        </label>
                        <select
                          name="time" required value={formData.time} onChange={handleChange}
                          onFocus={() => setFocused('time')} onBlur={() => setFocused(null)}
                          className={inputCls('time')}
                        >
                          <option value="">--:--</option>
                          {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> {t('reservation.guests')}
                      </label>
                      <select
                        name="guests" value={formData.guests} onChange={handleChange}
                        onFocus={() => setFocused('guests')} onBlur={() => setFocused(null)}
                        className={inputCls('guests')}
                      >
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                        <option value="9+">{t('reservation.guests.more')}</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                        <User className="w-3 h-3" /> {t('reservation.name')}
                      </label>
                      <input
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        placeholder="John Doe"
                        className={inputCls('name')}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {t('reservation.email')}
                        </label>
                        <input
                          type="email" name="email" required value={formData.email} onChange={handleChange}
                          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                          placeholder="you@example.com"
                          className={inputCls('email')}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {t('reservation.phone')}
                        </label>
                        <input
                          type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                          onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                          placeholder="+998 90 000 00 00"
                          className={inputCls('phone')}
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" /> {t('reservation.special')}
                        <span className="normal-case tracking-normal font-normal text-gray-300 ml-1">(optional)</span>
                      </label>
                      <textarea
                        name="special" rows={3} value={formData.special} onChange={handleChange}
                        onFocus={() => setFocused('special')} onBlur={() => setFocused(null)}
                        placeholder={t('reservation.special_placeholder')}
                        className={`${inputCls('special')} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="relative w-full overflow-hidden bg-bodrum-navy text-white py-4 rounded-sm text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg disabled:opacity-60 group mt-2"
                    >
                      <span className="relative z-10">
                        {status === 'submitting' ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                            />
                            {t('reservation.submitting')}
                          </span>
                        ) : t('reservation.submit')}
                      </span>
                      <span className="absolute inset-0 bg-bodrum-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                    </button>

                    <p className="text-center text-gray-400 text-xs mt-1">
                      We'll confirm your reservation within 30 minutes.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
