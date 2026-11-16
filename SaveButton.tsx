'use client';

import { useRef } from 'react';

interface Props {
  label: string;
  onClick: () => void | Promise<void>;
}

/* Botón de guardado que captura el texto original y lo restaura
   tras la operación asíncrona del padre. */
export function SaveButton({ label, onClick }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const originalRef = useRef<string>(label);

  return (
    <button
      ref={btnRef}
      className="btn btn-primary"
      data-save
      onClick={async () => {
        const btn = btnRef.current;
        if (!btn) return;
        originalRef.current = label;
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Guardando…';
        try {
          await onClick();
        } finally {
          btn.disabled = false;
          btn.textContent = originalRef.current || prev;
        }
      }}
    >
      {label}
    </button>
  );
}
