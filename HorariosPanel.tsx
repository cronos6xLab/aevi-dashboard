'use client';

import type { AppConfig, Horarios } from '../../lib/types';
import { DAY_NAMES } from '../../lib/utils';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function HorariosPanel({ config, updateConfig, onSave }: Props) {
  const horarios: Horarios = config.horarios || {};

  function setDay(d: number, times: string[]) {
    updateConfig((c) => ({
      ...c,
      horarios: { ...(c.horarios || {}), [String(d)]: times },
    }));
  }

  function addTime(d: number, value: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) {
      alert('Selecciona una hora válida');
      return;
    }
    const arr = (horarios[String(d)] || []).slice();
    if (!arr.includes(value)) arr.push(value);
    arr.sort();
    setDay(d, arr);
  }

  function removeTime(d: number, i: number) {
    const arr = (horarios[String(d)] || []).slice();
    arr.splice(i, 1);
    setDay(d, arr);
  }

  return (
    <section className="panel active">
      <div className="card">
        <h3>Horarios por día de la semana</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Los días sin horarios se muestran como cerrados en la página de reservas.
        </p>

        {DAY_NAMES.map((name, d) => {
          const times = horarios[String(d)] || horarios[d as unknown as string] || [];
          return (
            <DayRow
              key={d}
              name={name}
              times={times}
              onAdd={(v) => addTime(d, v)}
              onRemove={(i) => removeTime(d, i)}
            />
          );
        })}

        <button className="btn btn-primary" onClick={() => onSave()}>Guardar horarios</button>
      </div>
    </section>
  );
}

function DayRow({
  name,
  times,
  onAdd,
  onRemove,
}: {
  name: string;
  times: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="row-card">
      <div className="row-head">
        <strong>{name}</strong>
        <div className="row-actions">
          <input
            type="time"
            className="input-time"
            defaultValue=""
            id={`time-${name}`}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const el = document.getElementById(`time-${name}`) as HTMLInputElement;
              onAdd(el.value);
              el.value = '';
            }}
          >
            + Añadir
          </button>
        </div>
      </div>
      <div className="chips">
        {times.length === 0 ? (
          <span className="muted">Cerrado</span>
        ) : (
          times.map((t, i) => (
            <span className="chip" key={i}>
              {t}
              <button
                type="button"
                title="Quitar"
                onClick={() => onRemove(i)}
              >✕</button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
