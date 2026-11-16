'use client';

import { useState } from 'react';

interface Props {
  meta: { id: string; url: string } | null;
  onPasswordChange: (current: string, next: string) => Promise<boolean>;
}

export function AjustesPanel({ meta, onPasswordChange }: Props) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  return (
    <section className="panel active">
      <div className="card">
        <h3>Cambiar contraseña</h3>
        <label className="field">
          <span>Contraseña actual</span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Nueva contraseña (mín. 6 caracteres)</span>
          <input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={async () => {
            const ok = await onPasswordChange(current, next);
            if (ok) {
              setCurrent('');
              setNext('');
            }
          }}
        >
          Actualizar contraseña
        </button>
      </div>

      <div className="card">
        <h3>Hoja de cálculo</h3>
        <p className="muted">{meta?.id ? 'ID: ' + meta.id : '—'}</p>
        <div style={{ marginTop: 12 }}>
          {meta?.url ? (
            <a className="btn btn-ghost btn-sm" href={meta.url} target="_blank" rel="noopener">
              Abrir hoja de cálculo
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
