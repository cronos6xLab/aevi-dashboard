'use client';

import type { AppConfig, Cita } from '../../lib/types';
import { formatMoney, isoToday } from '../../lib/utils';

interface Props {
  citas: Cita[];
  config: AppConfig;
}

export function ResumenPanel({ citas, config }: Props) {
  const hoy = isoToday();
  const mes = hoy.slice(0, 7);
  const activas = citas.filter((c) => c.estado !== 'cancelada');

  const hoyCount = activas.filter((c) => c.fecha === hoy).length;
  const mesCount = activas.filter((c) => (c.fecha || '').startsWith(mes)).length;
  const ingresos = activas
    .filter((c) => (c.fecha || '').startsWith(mes))
    .reduce((s, c) => s + (Number(c.precio) || 0), 0);
  const serviciosOn = (config.servicios || []).filter((s) => s.activo !== false).length;

  const proximas = activas
    .filter((c) => c.fecha >= hoy)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 8);

  const currency = config.negocio?.moneda || 'MXN';

  const statCard = (value: string | number, label: string) => (
    <div className="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );

  return (
    <section className="panel active">
      <div className="stats">
        {statCard(hoyCount, 'Citas hoy')}
        {statCard(mesCount, 'Citas este mes')}
        {statCard(formatMoney(ingresos, currency), 'Ingresos del mes')}
        {statCard(serviciosOn, 'Servicios activos')}
      </div>

      <div className="card">
        <h3>Próximas citas</h3>
        <div className="table-wrap">
          <table>
            {proximas.length === 0 ? (
              <tbody>
                <tr><td className="muted">Aún no hay citas registradas.</td></tr>
              </tbody>
            ) : (
              <>
                <thead>
                  <tr>
                    <th>Fecha</th><th>Hora</th><th>Cliente</th>
                    <th>Servicio</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proximas.map((c) => (
                    <tr key={c._row}>
                      <td>{c.fecha}</td>
                      <td>{c.hora}</td>
                      <td>{c.nombre}</td>
                      <td>{c.servicio}</td>
                      <td><span className={'badge ' + c.estado}>{c.estado}</span></td>
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
