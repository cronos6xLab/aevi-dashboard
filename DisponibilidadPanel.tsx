'use client';

import type { AppConfig, Disponibilidad, Bloqueo } from '../../lib/types';
import { isoToday } from '../../lib/utils';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function DisponibilidadPanel({ config, updateConfig, onSave }: Props) {
  const d: Disponibilidad = config.disponibilidad || {
    anticipacionHoras: 2,
    maxDias: 60,
    diasCerrados: [],
    bloqueos: [],
  };

  function update(patch: Partial<Disponibilidad>) {
    updateConfig((c) => ({
      ...c,
      disponibilidad: { ...(c.disponibilidad || {}), ...patch } as Disponibilidad,
    }));
  }

  function addClosed(value: string) {
    if (!value) return;
    if ((d.diasCerrados || []).includes(value)) return;
    update({ diasCerrados: [...(d.diasCerrados || []), value].sort() });
  }
  function removeClosed(i: number) {
    const arr = (d.diasCerrados || []).slice();
    arr.splice(i, 1);
    update({ diasCerrados: arr });
  }

  function addBlock() {
    update({
      bloqueos: [...(d.bloqueos || []), { fecha: isoToday(), hora: '', motivo: '' }],
    });
  }
  function updateBlock(i: number, patch: Partial<Bloqueo>) {
    const arr = (d.bloqueos || []).slice();
    arr[i] = { ...arr[i], ...patch };
    update({ bloqueos: arr });
  }
  function removeBlock(i: number) {
    const arr = (d.bloqueos || []).slice();
    arr.splice(i, 1);
    update({ bloqueos: arr });
  }

  return (
    <section className="panel active">
      <div className="card">
        <h3>Reglas de reserva</h3>
        <div className="grid2">
          <label className="field">
            <span>Anticipación mínima (horas)</span>
            <input
              type="number"
              min={0}
              value={Number(d.anticipacionHoras) || 0}
              onChange={(e) => update({ anticipacionHoras: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            <span>Días máximos a futuro</span>
            <input
              type="number"
              min={1}
              value={Number(d.maxDias) || 60}
              onChange={(e) => update({ maxDias: Number(e.target.value) })}
            />
          </label>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Días cerrados</h3>
          <div className="row-actions">
            <input
              type="date"
              className="input-time"
              id="closedInput"
            />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const el = document.getElementById('closedInput') as HTMLInputElement;
                addClosed(el.value);
                el.value = '';
              }}
            >+ Añadir</button>
          </div>
        </div>
        <div className="chips">
          {(d.diasCerrados || []).length === 0 ? (
            <span className="muted">Sin días cerrados</span>
          ) : (
            (d.diasCerrados || []).map((f, i) => (
              <span className="chip" key={i}>
                {f}
                <button type="button" onClick={() => removeClosed(i)}>✕</button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Bloqueos puntuales</h3>
          <button className="btn btn-ghost btn-sm" onClick={addBlock}>+ Añadir bloqueo</button>
        </div>

        {(d.bloqueos || []).length === 0 ? (
          <p className="muted">Sin bloqueos puntuales.</p>
        ) : (
          (d.bloqueos || []).map((b, i) => (
            <div className="row-card" key={i}>
              <div className="row-head">
                <strong>{b.fecha} · {b.hora || 'Todo el día'}</strong>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeBlock(i)}
                >✕</button>
              </div>
              <div className="grid3">
                <label className="field">
                  <span>Fecha</span>
                  <input
                    type="date"
                    value={b.fecha ?? ''}
                    onChange={(e) => updateBlock(i, { fecha: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Hora (vacío = todo el día)</span>
                  <input
                    type="time"
                    value={b.hora ?? ''}
                    onChange={(e) => updateBlock(i, { hora: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Motivo</span>
                  <input
                    type="text"
                    value={b.motivo ?? ''}
                    onChange={(e) => updateBlock(i, { motivo: e.target.value })}
                  />
                </label>
              </div>
            </div>
          ))
        )}

        <button className="btn btn-primary" onClick={() => onSave()}>Guardar disponibilidad</button>
      </div>
    </section>
  );
}
