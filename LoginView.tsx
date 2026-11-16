'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (pass: string) => void;
  msg: string;
  loading: boolean;
}

export function LoginView({ onSubmit, msg, loading }: Props) {
  const [pass, setPass] = useState('');
  return (
    <div className="login-wrap">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) onSubmit(pass);
        }}
      >
        <div className="login-mark">A</div>
        <h1>Aevi Wellness</h1>
        <p>Panel de administración</p>
        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
        </label>
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
        <p className="login-msg">{msg}</p>
      </form>
    </div>
  );
}
