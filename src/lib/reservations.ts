export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  special: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

const STORAGE_KEY = 'bodrum_reservations';

function fmt(d: Date): string {
  return d.toISOString().split('T')[0];
}

function buildDemo(): Reservation[] {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

  return [
    { id: 'RES-001', name: 'Alisher Usmanov',  email: 'alisher@example.com', phone: '+998 90 123 45 67', date: fmt(today),    time: '19:00', guests: '4', special: '',                   status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'RES-002', name: 'Elena Petrova',     email: 'elena@example.com',   phone: '+998 91 234 56 78', date: fmt(today),    time: '20:30', guests: '2', special: 'Anniversary dinner', status: 'pending',   createdAt: new Date().toISOString() },
    { id: 'RES-003', name: 'John Smith',        email: 'john@example.com',    phone: '+998 93 345 67 89', date: fmt(tomorrow), time: '18:00', guests: '6', special: 'Birthday',           status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'RES-004', name: 'Malika Yusupova',   email: 'malika@example.com',  phone: '+998 94 456 78 90', date: fmt(today),    time: '19:30', guests: '3', special: '',                   status: 'pending',   createdAt: new Date().toISOString() },
    { id: 'RES-005', name: 'Sardor Mirzayev',   email: 'sardor@example.com',  phone: '+998 97 567 89 01', date: fmt(today),    time: '21:00', guests: '5', special: 'Window seat please', status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'RES-006', name: 'Maria García',      email: 'maria@example.com',   phone: '+998 95 678 90 12', date: fmt(dayAfter), time: '20:00', guests: '2', special: '',                   status: 'pending',   createdAt: new Date().toISOString() },
  ];
}

export function getReservations(): Reservation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const demo = buildDemo();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }
    const parsed = JSON.parse(stored) as Reservation[];
    // If every stored reservation is in the past, rebuild demo so stats stay meaningful
    const today = new Date().toISOString().split('T')[0];
    const hasFuture = parsed.some(r => r.date >= today);
    if (!hasFuture) {
      const demo = buildDemo();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }
    return parsed;
  } catch {
    return buildDemo();
  }
}

export function saveReservation(data: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Reservation {
  const existing = getReservations();
  const reservation: Reservation = {
    ...data,
    id: `RES-${String(existing.length + 1).padStart(3, '0')}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, reservation]));
  return reservation;
}

export function updateReservation(id: string, updates: Partial<Reservation>): void {
  const existing = getReservations();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.map(r => r.id === id ? { ...r, ...updates } : r)));
}

export function deleteReservation(id: string): void {
  const existing = getReservations();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter(r => r.id !== id)));
}

/** Reset to fresh demo data (for development/testing) */
export function resetDemo(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buildDemo()));
}
