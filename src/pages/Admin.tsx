import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, TrendingUp, Settings, Plus, Check, Trash2, Pencil, X, Lock, LogOut, Eye, EyeOff, User, ShieldAlert } from 'lucide-react';
import { getReservations, updateReservation, deleteReservation, saveReservation, type Reservation } from '@/lib/reservations';

const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME as string;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD as string;
const SESSION_KEY = 'bodrum_admin_auth';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 30_000; // ms
const TIME_SLOTS = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

const inputClass = 'w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-bodrum-gold transition-colors';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function Admin() {
  const { t } = useTranslation();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockSecs, setLockSecs] = useState(0);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editTarget, setEditTarget] = useState<Reservation | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '2', special: '' });

  useEffect(() => {
    if (authed) setReservations(getReservations());
  }, [authed]);

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) { setLockedUntil(null); setLockSecs(0); setAttempts(0); }
      else setLockSecs(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const refresh = () => setReservations(getReservations());

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) return;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAttempts(0);
      setAuthed(true);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setLoginError(true);
      setPassword('');
      if (next >= MAX_ATTEMPTS) setLockedUntil(Date.now() + LOCK_DURATION);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  const handleConfirm = (id: string) => {
    updateReservation(id, { status: 'confirmed' });
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteReservation(id);
    refresh();
  };

  const handleEditSave = () => {
    if (!editTarget) return;
    updateReservation(editTarget.id, editTarget);
    setEditTarget(null);
    refresh();
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    saveReservation({ ...addForm });
    setAddOpen(false);
    setAddForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2', special: '' });
    refresh();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter(r => r.date === todayStr);
  const totalGuestsToday = todayRes.reduce((sum, r) => sum + (parseInt(r.guests) || 0), 0);
  const avgCheck = 350000;
  const revenueRaw = totalGuestsToday * avgCheck;
  const revenueEst = revenueRaw >= 1_000_000
    ? (revenueRaw / 1_000_000).toFixed(1) + 'M UZS'
    : revenueRaw.toLocaleString('uz-UZ') + ' UZS';

  if (!authed) {
    const isLocked = !!lockedUntil && Date.now() < lockedUntil;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header band */}
          <div className="bg-bodrum-navy px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <img src="/bodrum_logo.jpg" alt="Bodrum" className="w-10 h-10 rounded-full object-cover ring-2 ring-bodrum-gold/40" />
              <span className="font-serif text-2xl font-bold tracking-wider text-bodrum-gold">BODRUM</span>
            </div>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Admin Portal</p>
          </div>

          {/* Form area */}
          <div className="px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-bodrum-gold" />
              <h2 className="text-bodrum-navy font-semibold text-sm uppercase tracking-widest">{t('admin.login.title')}</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              {/* Username */}
              <div>
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setLoginError(false); }}
                    placeholder="Enter username"
                    disabled={isLocked}
                    className={`${inputClass} pl-9 disabled:opacity-50 disabled:cursor-not-allowed`}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLoginError(false); }}
                    placeholder="Enter password"
                    disabled={isLocked}
                    className={`${inputClass} pl-9 pr-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bodrum-gold transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error / lockout */}
              <AnimatePresence mode="wait">
                {isLocked ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-3 py-2.5"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-xs">Account locked. Try again in <strong>{lockSecs}s</strong>.</p>
                  </motion.div>
                ) : loginError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-3 py-2.5"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-xs">
                      {t('admin.login.error')}{' '}
                      {attempts > 0 && attempts < MAX_ATTEMPTS && (
                        <span className="text-red-400">({MAX_ATTEMPTS - attempts} attempts left)</span>
                      )}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLocked}
                className="w-full bg-bodrum-navy text-white py-3 rounded-sm text-sm font-semibold uppercase tracking-widest hover:bg-bodrum-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {t('admin.login.submit')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-bodrum-navy">{t('admin.dashboard')}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-bodrum-gold hover:bg-bodrum-gold-dark text-white px-4 py-2 rounded-sm text-sm font-medium uppercase tracking-wide transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('admin.addReservation')}
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-bodrum-navy transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-bodrum-navy transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            { label: t('admin.stats.bookings'), value: String(todayRes.length), icon: Calendar },
            { label: t('admin.stats.guests'), value: String(totalGuestsToday), icon: Users },
            { label: t('admin.stats.revenue'), value: revenueEst, icon: TrendingUp },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-bodrum-gold/10 rounded-full flex items-center justify-center text-bodrum-gold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-serif text-bodrum-navy mt-0.5">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-serif text-xl text-bodrum-navy">{t('admin.recent')}</h2>
            <span className="text-xs text-gray-400">{reservations.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3 font-semibold">{t('admin.table.id')}</th>
                  <th className="px-5 py-3 font-semibold">{t('admin.table.guest')}</th>
                  <th className="px-5 py-3 font-semibold">{t('admin.table.datetime')}</th>
                  <th className="px-5 py-3 font-semibold">{t('admin.table.party')}</th>
                  <th className="px-5 py-3 font-semibold">{t('admin.table.status')}</th>
                  <th className="px-5 py-3 font-semibold text-right">{t('admin.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{res.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-bodrum-navy">{res.name}</p>
                      <p className="text-xs text-gray-400">{res.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{res.date} · {res.time}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{res.guests}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {res.status === 'confirmed' ? t('admin.status.confirmed') : t('admin.status.pending')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex gap-2 justify-end">
                        {res.status === 'pending' && (
                          <button onClick={() => handleConfirm(res.id)} title={t('admin.action.confirm')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setEditTarget({ ...res })} title={t('admin.action.edit')} className="p-1.5 text-bodrum-navy hover:bg-gray-100 rounded transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(res.id)} title={t('admin.action.delete')} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editTarget && (
          <Modal title={t('admin.modal.edit')} onClose={() => setEditTarget(null)}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('admin.modal.name')}</label>
                <input className={inputClass} value={editTarget.name} onChange={e => setEditTarget(p => p && ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('admin.modal.date')}</label>
                  <input type="date" className={inputClass} value={editTarget.date} onChange={e => setEditTarget(p => p && ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>{t('admin.modal.time')}</label>
                  <select className={inputClass} value={editTarget.time} onChange={e => setEditTarget(p => p && ({ ...p, time: e.target.value }))}>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('admin.modal.guests')}</label>
                  <select className={inputClass} value={editTarget.guests} onChange={e => setEditTarget(p => p && ({ ...p, guests: e.target.value }))}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="9+">9+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('admin.modal.status')}</label>
                  <select className={inputClass} value={editTarget.status} onChange={e => setEditTarget(p => p && ({ ...p, status: e.target.value as 'confirmed' | 'pending' }))}>
                    <option value="pending">{t('admin.status.pending')}</option>
                    <option value="confirmed">{t('admin.status.confirmed')}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleEditSave} className="flex-1 bg-bodrum-navy text-white py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide hover:bg-bodrum-navy/90 transition-colors">
                  {t('admin.modal.save')}
                </button>
                <button onClick={() => setEditTarget(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  {t('admin.modal.cancel')}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {addOpen && (
          <Modal title={t('admin.addReservation')} onClose={() => setAddOpen(false)}>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={labelClass}>{t('admin.modal.name')}</label>
                <input required className={inputClass} value={addForm.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="Guest name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('reservation.email')}</label>
                  <input type="email" required className={inputClass} value={addForm.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div>
                  <label className={labelClass}>{t('reservation.phone')}</label>
                  <input required className={inputClass} value={addForm.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddForm(p => ({ ...p, phone: e.target.value }))} placeholder="+998 90 000 00 00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('admin.modal.date')}</label>
                  <input type="date" required className={inputClass} value={addForm.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>{t('admin.modal.time')}</label>
                  <select required className={inputClass} value={addForm.time} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAddForm(p => ({ ...p, time: e.target.value }))}>
                    <option value="">--:--</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('admin.modal.guests')}</label>
                <select className={inputClass} value={addForm.guests} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAddForm(p => ({ ...p, guests: e.target.value }))}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="9+">9+</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-bodrum-gold text-white py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide hover:bg-bodrum-gold-dark transition-colors">
                  {t('admin.addReservation')}
                </button>
                <button type="button" onClick={() => setAddOpen(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  {t('admin.modal.cancel')}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-sm shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl text-bodrum-navy">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
