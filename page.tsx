'use client';

import { useEffect, useState } from 'react';
import { api, authed, clearToken, getToken, setToken } from '../lib/api';
import type { AppConfig, Cita, CitaEstado, Dashboard } from '../lib/types';
import { LoginView } from '../components/LoginView';
import { Sidebar, TITLES } from '../components/Sidebar';
import { ResumenPanel } from '../components/panels/ResumenPanel';
import { NegocioPanel } from '../components/panels/NegocioPanel';
import { ContactoPanel } from '../components/panels/ContactoPanel';
import { UbicacionPanel } from '../components/panels/UbicacionPanel';
import { ServiciosPanel } from '../components/panels/ServiciosPanel';
import { HorariosPanel } from '../components/panels/HorariosPanel';
import { DisponibilidadPanel } from '../components/panels/DisponibilidadPanel';
import { ImagenesPanel } from '../components/panels/ImagenesPanel';
import { CitasPanel } from '../components/panels/CitasPanel';
import { AjustesPanel } from '../components/panels/AjustesPanel';
import { Toast } from '../components/Toast';

export type SectionKey = keyof typeof TITLES;

export default function Page() {
  const [token, setTokenState] = useState<string>('');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [meta, setMeta] = useState<{ id: string; url: string } | null>(null);
  const [section, setSection] = useState<SectionKey>('resumen');
  const [loginMsg, setLoginMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; err: boolean } | null>(null);

  // Toast helper
  function showToast(msg: string, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2600);
  }

  /* ----- Boot: si hay token guardado, intentar cargar dashboard ----- */
  useEffect(() => {
    const t = getToken();
    if (!t) {
      setLoading(false);
      return;
    }
    loadAll().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    try {
      const data = await authed(api.getDashboard);
      setConfig(data.config);
      setCitas(data.citas || []);
      setMeta({ id: data.spreadsheetId, url: data.spreadsheetUrl });
    } catch (e: any) {
      clearToken();
      setLoginMsg(e?.message || '');
    }
  }

  async function handleLogin(pass: string) {
    setLoginLoading(true);
    setLoginMsg('Verificando…');
    try {
      const res = await api.login(pass);
      if (!res.ok) {
        setLoginMsg(res.error || 'No se pudo entrar');
        return;
      }
      setToken(res.token);
      setTokenState(res.token);
      setLoginMsg('');
      await loadAll();
    } catch (err: any) {
      setLoginMsg(err?.message || 'Error de conexión');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    const t = getToken();
    if (t) {
      try { await api.logout(t); } catch {}
    }
    clearToken();
    setTokenState('');
    setConfig(null);
    setCitas([]);
    setMeta(null);
    setLoginMsg('');
  }

  /* ----- Save section (genérico) ----- */
  async function saveSection<K extends keyof AppConfig>(
    key: K,
    value: AppConfig[K],
    btn?: HTMLButtonElement | null,
    originalText?: string
  ) {
    if (btn) {
      btn.disabled = true;
      const prev = btn.textContent;
      btn.textContent = 'Guardando…';
      try {
        await authed((tok) => api.saveSection(tok, key, value));
        showToast('Guardado ✓');
      } catch (e: any) {
        showToast(e?.message || 'No se pudo guardar', true);
      } finally {
        btn.disabled = false;
        btn.textContent = originalText || prev;
      }
    } else {
      try {
        await authed((tok) => api.saveSection(tok, key, value));
        showToast('Guardado ✓');
      } catch (e: any) {
        showToast(e?.message || 'No se pudo guardar', true);
      }
    }
  }

  /* ----- updateConfig helper que asegura no-null ----- */
  function updateConfig(updater: (c: AppConfig) => AppConfig) {
    setConfig((prev) => (prev ? updater(prev) : prev));
  }

  /* ----- Render ----- */
  if (loading) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-mark">A</div>
          <h1>Cargando…</h1>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <>
        <LoginView
          onSubmit={handleLogin}
          msg={loginMsg}
          loading={loginLoading}
        />
        {toast && <Toast msg={toast.msg} err={toast.err} />}
      </>
    );
  }

  return (
    <>
      <div className="app">
        <div
          className={'backdrop' + (sidebarOpen ? ' show' : '')}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          active={section}
          onSelect={(s) => {
            setSection(s);
            setSidebarOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          open={sidebarOpen}
          onLogout={handleLogout}
          config={config}
        />

        <main className="main">
          <header className="topbar">
            <button
              className="menu-btn"
              aria-label="Menú"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              ☰
            </button>
            <h2>{TITLES[section]}</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                try {
                  await loadAll();
                  showToast('Datos actualizados ✓');
                } catch (e: any) {
                  showToast(e?.message, true);
                }
              }}
            >
              Recargar
            </button>
          </header>

          <div className="content">
            {section === 'resumen' && (
              <ResumenPanel citas={citas} config={config} />
            )}

            {section === 'negocio' && (
              <NegocioPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('negocio', config.negocio)}
              />
            )}

            {section === 'contacto' && (
              <ContactoPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('contacto', config.contacto)}
              />
            )}

            {section === 'ubicacion' && (
              <UbicacionPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('ubicacion', config.ubicacion)}
              />
            )}

            {section === 'servicios' && (
              <ServiciosPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('servicios', config.servicios)}
              />
            )}

            {section === 'horarios' && (
              <HorariosPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('horarios', config.horarios)}
              />
            )}

            {section === 'disponibilidad' && (
              <DisponibilidadPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('disponibilidad', config.disponibilidad)}
              />
            )}

            {section === 'imagenes' && (
              <ImagenesPanel
                config={config}
                updateConfig={updateConfig}
                onSave={() => saveSection('imagenes', config.imagenes)}
              />
            )}

            {section === 'citas' && (
              <CitasPanel
                citas={citas}
                config={config}
                onRefresh={async () => {
                  try {
                    const fresh = await authed(api.getCitas);
                    setCitas(fresh || []);
                    showToast('Citas actualizadas ✓');
                  } catch (e: any) {
                    showToast(e?.message, true);
                  }
                }}
                onEstadoChange={async (row, estado) => {
                  try {
                    await authed((tok) => api.updateCitaEstado(tok, row, estado));
                    setCitas((cs) =>
                      cs.map((c) => (c._row === row ? { ...c, estado } : c))
                    );
                    showToast('Estado actualizado ✓');
                  } catch (e: any) {
                    showToast(e?.message, true);
                  }
                }}
                onDelete={async (row) => {
                  try {
                    await authed((tok) => api.deleteCita(tok, row));
                    setCitas((cs) => cs.filter((c) => c._row !== row));
                    showToast('Cita eliminada');
                  } catch (e: any) {
                    showToast(e?.message, true);
                  }
                }}
              />
            )}

            {section === 'ajustes' && (
              <AjustesPanel
                meta={meta}
                onPasswordChange={async (current, next) => {
                  try {
                    const t = getToken();
                    if (!t) throw new Error('Sesión expirada');
                    const res = await api.changePassword(t, current, next);
                    if (!res.ok) {
                      showToast(res.error, true);
                      return false;
                    }
                    showToast('Contraseña actualizada ✓');
                    return true;
                  } catch (e: any) {
                    showToast(e?.message, true);
                    return false;
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>

      {toast && <Toast msg={toast.msg} err={toast.err} />}
    </>
  );
}
