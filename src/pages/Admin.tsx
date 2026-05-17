import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, TrendingUp, Settings, Plus, Check, Trash2, Pencil, X, Lock, LogOut } from 'lucide-react';
import { getReservations, updateReservation, deleteReservation, saveReservation, type Reservation } from '@/lib/reservations';

const ADMIN_PIN = '1234';
const SESSION_KEY = 'bodrum_admin_auth';
const TIME_SLOTS = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

const inputClass = 'w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-bodrum-gold transition-colors';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function Admin() {
  const { t } = useTranslation();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editTarget, setEditTarget] = useState<Reservation | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '2', special: '' });

  useEffect(() => {
    if (authed) setReservations(getReservations());
  }, [authed]);

  const refresh = () => setReservations(getReservations());

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setPinError(true);
      setPin('');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-sm shadow-xl p-10 w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-bodrum-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-bodrum-gold" />
          </div>
          <h1 className="font-serif text-2xl text-bodrum-navy mb-2">{t('admin.login.title')}</h1>
          <p className="text-gray-400 text-sm mb-8">PIN: 1234</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              placeholder="• • • •"
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-bodrum-gold transition-colors"
            />
            {pinError && <p className="text-red-500 text-xs">{t('admin.login.error')}</p>}
            <button type="submit" className="w-full bg-bodrum-navy text-white py-3 rounded-sm text-sm font-semibold uppercase tracking-widest hover:bg-bodrum-navy/90 transition-colors">
              {t('admin.login.submit')}
            </button>
          </form>
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
