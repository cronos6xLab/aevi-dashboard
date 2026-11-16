// Cliente HTTP para el panel admin. Habla con la API REST de Apps Script.
//
// El token de sesión se guarda en sessionStorage (clave 'aevi_token').
// Se envía en cada request que requiere auth como parte del body JSON
// (Apps Script no permite Authorization header en web apps).

import type { AppConfig, Cita, CitaEstado, Dashboard } from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://script.google.com/macros/s/REEMPLAZA-CON-TU-ID/exec';

export function getToken(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('aevi_token') || '';
}

export function setToken(t: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('aevi_token', t);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('aevi_token');
}

async function getJson<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error('Error de conexión (' + res.status + ')');
  return res.json() as Promise<T>;
}

async function postJson<TResp>(
  action: string,
  body: Record<string, unknown>
): Promise<TResp> {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  const res = await fetch(url.toString(), {
    method: 'POST',
    // text/plain evita el preflight CORS que Apps Script no maneja
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error de conexión (' + res.status + ')');
  return res.json() as Promise<TResp>;
}

/* =========================================================
   Auth
   ========================================================= */
export const api = {
  login: (pass: string) =>
    postJson<{ ok: true; token: string } | { ok: false; error: string }>('login', { pass }),

  logout: (token: string) =>
    postJson<{ ok: true }>('logout', { token }),

  changePassword: (token: string, current: string, next: string) =>
    postJson<{ ok: true } | { ok: false; error: string }>('changePassword', {
      token, current, next,
    }),

  /* =========================================================
     Dashboard
     ========================================================= */
  getDashboard: (token: string) =>
    getJson<Dashboard>('dashboard', { token }),

  getCitas: (token: string) =>
    getJson<Cita[]>('citas', { token }),

  updateCitaEstado: (token: string, row: number, estado: CitaEstado) =>
    postJson<{ ok: true }>('updateCitaEstado', { token, row, estado }),

  deleteCita: (token: string, row: number) =>
    postJson<{ ok: true }>('deleteCita', { token, row }),

  saveSection: <K extends keyof AppConfig>(
    token: string,
    key: K,
    value: AppConfig[K]
  ) =>
    postJson<{ ok: true }>('saveSection', {
      token,
      key,
      value: value as unknown,
    }),
};

/* =========================================================
   Helper: request autenticada (le añade el token)
   ========================================================= */
export async function authed<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Sesión expirada o inválida');
  try {
    return await fn(token);
  } catch (err: any) {
    if (/sesi[oó]n/i.test(err?.message || '')) {
      clearToken();
    }
    throw err;
  }
}
