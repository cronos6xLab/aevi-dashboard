'use client';

import { useState } from 'react';
import type { AppConfig, Cita, CitaEstado } from '../../lib/types';
import { ESTADOS, formatMoney } from '../../lib/utils';

interface Props {
  citas: Cita[];
  config: AppConfig;
  onRefresh: () => void | Promise<void>;
  onEstadoChange: (row: number, estado: CitaEstado) => void | Promise<void>;
  onDelete: (row: number) => void | Promise<void>;
}

export function CitasPanel({ citas, config, onRefresh, onEstadoChange, onDelete }: Props) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'' | CitaEstado>('');

  const currency = config.negocio?.moneda || 'MXN';

  let rows = citas.slice().sort((a, b) =>
    (b.fecha + b.hora).localeCompare(a.fecha + a.hora)
  );
  if (filter) rows = rows.filter((c) => c.estado === filter);
  if (q.trim()) {
    const ql = q.toLowerCase().trim();
    rows = rows.filter((c) =>
      ((c.nombre || '') + ' ' + (c.email || '') + ' ' + (c.servicio || '')).toLowerCase().includes(ql)
    );
  }

  return (
    <section className="panel active">
      <div className="card">
        <h3>Citas recibidas</h3>
        <div className="toolbar">
          <input
            type="text"
            placeholder="Buscar cliente, correo o servicio…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value as '' | CitaEstado)}>
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={onRefresh}>Actualizar</button>
        </div>

        <div className="table-wrap">
          <table>
            {rows.length === 0 ? (
              <tbody>
                <tr><td className="muted" style={{ padding: '20px 12px' }}>No hay citas que coincidan.</td></tr>
              </tbody>
            ) : (
              <>
                <thead>
                  <tr>
                    <th>Fecha</th><th>Hora</th><th>Cliente</th><th>Contacto</th>
                    <th>Servicio</th><th>Total</th><th>Estado</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c._row}>
                      <td>{c.fecha}</td>
                      <td>{c.hora}</td>
                      <td>{c.nombre}</td>
                      <td className="muted">{c.email}<br />{c.telefono || ''}</td>
                      <td>{c.servicio}</td>
                      <td>{formatMoney(Number(c.precio) || 0, currency)}</td>
                      <td>
                        <select
                          value={c.estado}
                          onChange={(e) => onEstadoChange(c._row, e.target.value as CitaEstado)}
                        >
                          {ESTADOS.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="icon-btn"
                          title="Eliminar"
                          onClick={() => {
                            if (confirm('¿Eliminar esta cita definitivamente?')) {
                              onDelete(c._row);
                            }
                          }}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </section>
  );
}
