'use client';

import type { AppConfig, Servicio } from '../../lib/types';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function ServiciosPanel({ config, updateConfig, onSave }: Props) {
  const servicios = config.servicios || [];

  function updateAt(i: number, patch: Partial<Servicio>) {
    updateConfig((c) => {
      const arr = (c.servicios || []).slice();
      arr[i] = { ...arr[i], ...patch };
      return { ...c, servicios: arr };
    });
  }

  function removeAt(i: number) {
    if (!confirm('¿Eliminar este servicio?')) return;
    updateConfig((c) => {
      const arr = (c.servicios || []).slice();
      arr.splice(i, 1);
      return { ...c, servicios: arr };
    });
  }

  function add() {
    updateConfig((c) => ({
      ...c,
      servicios: [
        ...(c.servicios || []),
        {
          id: 'servicio-' + Date.now(),
          nombre: 'Nuevo servicio',
          descripcion: '',
          duracion: 60,
          precio: 0,
          activo: true,
        },
      ],
    }));
  }

  return (
    <section className="panel active">
      <div className="card">
        <div className="card-head">
          <h3>Catálogo de servicios</h3>
          <button className="btn btn-ghost btn-sm" onClick={add}>+ Añadir servicio</button>
        </div>

        {servicios.length === 0 && <p className="muted">No hay servicios. Añade el primero.</p>}

        {servicios.map((s, i) => (
          <div className="row-card" key={s.id || i}>
            <div className="row-head">
              <strong>{s.nombre || 'Servicio sin nombre'}</strong>
              <div className="row-actions">
                <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={s.activo !== false}
                    onChange={(e) => updateAt(i, { activo: e.target.checked })}
                  />
                  Activo
                </label>
                <button
                  type="button"
                  className="icon-btn"
                  title="Eliminar"
                  onClick={() => removeAt(i)}
                >✕</button>
              </div>
            </div>
            <div className="grid2">
              <label className="field">
                <span>Nombre</span>
                <input type="text" value={s.nombre ?? ''} onChange={(e) => updateAt(i, { nombre: e.target.value })} />
              </label>
              <label className="field">
                <span>ID interno</span>
                <input type="text" value={s.id ?? ''} onChange={(e) => updateAt(i, { id: e.target.value })} />
              </label>
              <label className="field">
                <span>Duración (min)</span>
                <input
                  type="number"
                  value={Number(s.duracion) || 0}
                  onChange={(e) => updateAt(i, { duracion: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                <span>Precio</span>
                <input
                  type="number"
                  value={Number(s.precio) || 0}
                  onChange={(e) => updateAt(i, { precio: Number(e.target.value) })}
                />
              </label>
            </div>
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Descripción</span>
              <input type="text" value={s.descripcion ?? ''} onChange={(e) => updateAt(i, { descripcion: e.target.value })} />
            </label>
          </div>
        ))}

        <button className="btn btn-primary" onClick={() => onSave()}>Guardar servicios</button>
      </div>
    </section>
  );
}
