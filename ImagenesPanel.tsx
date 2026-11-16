'use client';

import type { AppConfig, Imagen } from '../../lib/types';

interface Props {
  config: AppConfig;
  updateConfig: (updater: (c: AppConfig) => AppConfig) => void;
  onSave: () => void | Promise<void>;
}

export function ImagenesPanel({ config, updateConfig, onSave }: Props) {
  const imagenes: Imagen[] = config.imagenes || [];

  function updateAt(i: number, patch: Partial<Imagen>) {
    updateConfig((c) => {
      const arr = (c.imagenes || []).slice();
      arr[i] = { ...arr[i], ...patch };
      return { ...c, imagenes: arr };
    });
  }
  function removeAt(i: number) {
    updateConfig((c) => {
      const arr = (c.imagenes || []).slice();
      arr.splice(i, 1);
      return { ...c, imagenes: arr };
    });
  }
  function add() {
    updateConfig((c) => ({
      ...c,
      imagenes: [...(c.imagenes || []), { url: '', alt: '' }],
    }));
  }

  return (
    <section className="panel active">
      <div className="card">
        <div className="card-head">
          <h3>Galería de imágenes</h3>
          <button className="btn btn-ghost btn-sm" onClick={add}>+ Añadir imagen</button>
        </div>

        {imagenes.length === 0 ? (
          <p className="muted">Sin imágenes. Añade la primera.</p>
        ) : (
          <div className="gallery">
            {imagenes.map((img, i) => (
              <div className="gal-item" key={i}>
                <div
                  className="gal-thumb"
                  style={img.url ? { backgroundImage: `url('${img.url}')` } : undefined}
                >
                  {img.url ? '' : 'Sin imagen'}
                </div>
                <div className="gal-body">
                  <input
                    type="text"
                    placeholder="https://…"
                    value={img.url}
                    onChange={(e) => updateAt(i, { url: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={img.alt}
                    onChange={(e) => updateAt(i, { alt: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => removeAt(i)}
                  >Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => onSave()}>Guardar imágenes</button>
        </div>
      </div>
    </section>
  );
}
