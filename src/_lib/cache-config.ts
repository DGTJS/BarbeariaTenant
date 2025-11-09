// Configuração de cache para o sistema
export const CACHE_KEYS = {
  BARBERS: 'barbers',
  SERVICES: 'services',
  CATEGORIES: 'categories',
  BOOKINGS: 'bookings',
  HOME_DATA: 'home-data',
} as const;

export const CACHE_TIMES = {
  BARBERS: 60 * 60, // 1 hora
  SERVICES: 60 * 60, // 1 hora
  CATEGORIES: 60 * 60 * 24, // 24 horas (muda raramente)
  BOOKINGS: 5 * 60, // 5 minutos
  HOME_DATA: 30 * 60, // 30 minutos
} as const;

// Client-side cache timestamps
export function getCacheTimestamp(key: string): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`cache_${key}_timestamp`);
  return stored ? parseInt(stored, 10) : null;
}

export function setCacheTimestamp(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`cache_${key}_timestamp`, Date.now().toString());
}

export function isCacheValid(key: string, maxAge: number): boolean {
  const timestamp = getCacheTimestamp(key);
  if (!timestamp) return false;
  return Date.now() - timestamp < maxAge * 1000;
}

export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`cache_${key}_timestamp`);
  localStorage.removeItem(`cache_${key}_data`);
}

