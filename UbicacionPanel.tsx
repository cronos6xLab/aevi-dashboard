'use client';

import type { AppConfig, Ubicacion } from '../../lib/types';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function UbicacionPanel({ config, updateConfig, onSave }: Props) {
  const u = config.ubicacion;

  const update = (patch: Partial<Ubicacion>) =>
    updateConfig((c) => ({ ...c, ubicacion: { ...c.ubicacion, ...patch } }));

  return (
    <section className="panel active">
      <div className="card">
        <h3>Mapa y navegación</h3>
        <label className="field">
          <span>URL del iframe del mapa (embed)</span>
          <textarea
            placeholder="https://www.openstreetmap.org/export/embed.html?..."
            value={u.mapEmbed ?? ''}
            onChange={(e) => update({ mapEmbed: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Enlace de navegación (abrir en Google Maps)</span>
          <input
            type="text"
            placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
            value={u.mapLink ?? ''}
            onChange={(e) => update({ mapLink: e.target.value })}
          />
        </label>
        <div className="grid2">
          <label className="field">
            <span>Latitud</span>
            <input type="text" value={u.lat ?? ''} onChange={(e) => update({ lat: e.target.value })} />
          </label>
          <label className="field">
            <span>Longitud</span>
            <input type="text" value={u.lng ?? ''} onChange={(e) => update({ lng: e.target.value })} />
          </label>
        </div>
        <div className="map-preview">
          {u.mapEmbed ? (
            <iframe src={u.mapEmbed} loading="lazy" title="Vista previa del mapa" />
          ) : (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#999', fontSize: 13 }}>
              Sin mapa configurado
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => onSave()}>Guardar ubicación</button>
        </div>
      </div>
    </section>
  );
}
