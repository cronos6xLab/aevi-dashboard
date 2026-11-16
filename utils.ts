// Utilidades compartidas

export const esc = (v: unknown): string =>
  String(v == null ? '' : v).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

export const isoToday = () => {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

export function getPath<T = any>(obj: any, path: string): T {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj) as T;
}

export function setPath(obj: any, path: string, val: any) {
  const keys = path.split('.');
  const last = keys.pop()!;
  let o = obj;
  keys.forEach((k) => {
    if (typeof o[k] !== 'object' || o[k] === null) o[k] = {};
    o = o[k];
  });
  o[last] = val;
}

export function formatMoney(n: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'MXN',
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return '$' + (n || 0);
  }
}

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const ESTADOS: Array<'pendiente' | 'confirmada' | 'completada' | 'cancelada'> =
  ['pendiente', 'confirmada', 'completada', 'cancelada'];
