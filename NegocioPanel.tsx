'use client';

import type { AppConfig, Negocio } from '../../lib/types';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function NegocioPanel({ config, updateConfig, onSave }: Props) {
  const n = config.negocio;

  const update = (patch: Partial<Negocio>) =>
    updateConfig((c) => ({ ...c, negocio: { ...c.negocio, ...patch } }));

  return (
    <section className="panel active">
      <div className="card">
        <h3>Identidad del negocio</h3>
        <div className="grid2">
          <label className="field">
            <span>Nombre</span>
            <input type="text" value={n.nombre ?? ''} onChange={(e) => update({ nombre: e.target.value })} />
          </label>
          <label className="field">
            <span>Tagline</span>
            <input type="text" value={n.tagline ?? ''} onChange={(e) => update({ tagline: e.target.value })} />
          </label>
          <label className="field">
            <span>URL del logo</span>
            <input type="text" placeholder="https://..." value={n.logoUrl ?? ''} onChange={(e) => update({ logoUrl: e.target.value })} />
          </label>
          <label className="field">
            <span>Moneda</span>
            <input type="text" placeholder="MXN" value={n.moneda ?? ''} onChange={(e) => update({ moneda: e.target.value })} />
          </label>
          <label className="field">
            <span>Color primario</span>
            <input type="color" value={n.colorPrimario ?? '#244d54'} onChange={(e) => update({ colorPrimario: e.target.value })} />
          </label>
          <label className="field">
            <span>Color de acento</span>
            <input type="color" value={n.colorAcento ?? '#2ecea0'} onChange={(e) => update({ colorAcento: e.target.value })} />
          </label>
        </div>
        <label className="field">
          <span>Texto del anuncio superior</span>
          <input type="text" value={n.anuncio ?? ''} onChange={(e) => update({ anuncio: e.target.value })} />
        </label>
        <label className="field">
          <span>Texto del hero</span>
          <textarea value={n.heroTexto ?? ''} onChange={(e) => update({ heroTexto: e.target.value })} />
        </label>
        <button className="btn btn-primary" onClick={() => onSave()}>Guardar negocio</button>
      </div>
    </section>
  );
}
