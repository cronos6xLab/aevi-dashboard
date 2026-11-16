'use client';

import type { AppConfig, Contacto } from '../../lib/types';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function ContactoPanel({ config, updateConfig, onSave }: Props) {
  const c = config.contacto;

  const update = (patch: Partial<Contacto>) =>
    updateConfig((cfg) => ({ ...cfg, contacto: { ...cfg.contacto, ...patch } }));

  return (
    <section className="panel active">
      <div className="card">
        <h3>Datos de contacto</h3>
        <div className="grid2">
          <label className="field">
            <span>Teléfono</span>
            <input type="tel" value={c.telefono ?? ''} onChange={(e) => update({ telefono: e.target.value })} />
          </label>
          <label className="field">
            <span>WhatsApp (solo dígitos)</span>
            <input type="text" placeholder="525512345678" value={c.whatsapp ?? ''} onChange={(e) => update({ whatsapp: e.target.value })} />
          </label>
          <label className="field">
            <span>Correo</span>
            <input type="email" value={c.email ?? ''} onChange={(e) => update({ email: e.target.value })} />
          </label>
          <label className="field">
            <span>Dirección</span>
            <input type="text" value={c.direccion ?? ''} onChange={(e) => update({ direccion: e.target.value })} />
          </label>
        </div>
        <label className="field">
          <span>Horario (texto visible)</span>
          <input type="text" value={c.horarioTexto ?? ''} onChange={(e) => update({ horarioTexto: e.target.value })} />
        </label>
        <label className="field">
          <span>Estacionamiento</span>
          <input type="text" value={c.estacionamiento ?? ''} onChange={(e) => update({ estacionamiento: e.target.value })} />
        </label>
      </div>
      <div className="card">
        <h3>Redes sociales</h3>
        <div className="grid3">
          <label className="field">
            <span>Instagram</span>
            <input type="text" placeholder="https://instagram.com/..." value={c.instagram ?? ''} onChange={(e) => update({ instagram: e.target.value })} />
          </label>
          <label className="field">
            <span>Facebook</span>
            <input type="text" placeholder="https://facebook.com/..." value={c.facebook ?? ''} onChange={(e) => update({ facebook: e.target.value })} />
          </label>
          <label className="field">
            <span>TikTok</span>
            <input type="text" placeholder="https://tiktok.com/@..." value={c.tiktok ?? ''} onChange={(e) => update({ tiktok: e.target.value })} />
          </label>
        </div>
        <button className="btn btn-primary" onClick={() => onSave()}>Guardar contacto</button>
      </div>
    </section>
  );
}
