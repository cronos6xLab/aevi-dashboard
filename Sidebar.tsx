'use client';

import type { AppConfig } from '../lib/types';

export const TITLES = {
  resumen: 'Resumen',
  negocio: 'Negocio',
  contacto: 'Contacto y redes',
  ubicacion: 'Ubicación',
  servicios: 'Servicios',
  horarios: 'Horarios',
  disponibilidad: 'Disponibilidad',
  imagenes: 'Imágenes',
  citas: 'Citas',
  ajustes: 'Ajustes',
} as const;

export type SectionKey = keyof typeof TITLES;

interface Props {
  active: SectionKey;
  onSelect: (s: SectionKey) => void;
  open: boolean;
  onLogout: () => void;
  config: AppConfig;
}

export function Sidebar({ active, onSelect, open, onLogout, config }: Props) {
  const n = config.negocio;
  const logoInitial = (n?.nombre || 'A').trim().charAt(0).toUpperCase();

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="brand">
        <div className="brand-logo">
          {n?.logoUrl ? <img src={n.logoUrl} alt="" /> : logoInitial}
        </div>
        <div>
          <strong>{n?.nombre || 'Aevi Wellness'}</strong>
          <span>Panel</span>
        </div>
      </div>

      {(Object.keys(TITLES) as SectionKey[]).map((s) => (
        <button
          key={s}
          className={'nav-btn' + (active === s ? ' active' : '')}
          onClick={() => onSelect(s)}
        >
          <i className="dot" />
          {TITLES[s]}
        </button>
      ))}

      <div className="sidebar-foot">
        <button className="nav-btn" onClick={onLogout}>← Cerrar sesión</button>
      </div>
    </aside>
  );
}
