# aevi-dashboard

Panel **privado** de administración para Aevi Wellness. Desplegado en Vercel.
Permite editar toda la configuración del negocio (servicios, horarios, contacto, ubicación, etc.) y gestionar las citas que crea la página pública.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Estilos: CSS plano transplantado del HTML original (en `app/globals.css`)
- Sin ORM ni DB propia: usa la API REST de Google Apps Script

## Variables de entorno
Copia `.env.local.example` a `.env.local` y rellena:

```
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/TU-SCRIPT-ID/exec
```

La URL es la misma que te da Apps Script en **Implementar → Administrar implementaciones → Aplicación web**.

En Vercel: **Settings → Environment Variables** → añade `NEXT_PUBLIC_API_URL` con el mismo valor.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Contraseña por defecto: `aevi2025` (cámbiala desde Ajustes la primera vez).

## Despliegue en Vercel

1. Sube este repo a GitHub (p. ej. `aevi-dashboard`).
2. Entra a [vercel.com](https://vercel.com) → Add New Project → importa el repo.
3. Framework preset: **Next.js** (se autodetecta).
4. En **Environment Variables** añade `NEXT_PUBLIC_API_URL` con la URL de tu Apps Script.
5. Deploy. Vercel te da una URL tipo `aevi-dashboard.vercel.app`.

> ⚠️ Recomendado: protege esta URL una vez desplegada. Opciones:
> - Vercel → **Password Protection** (en Pro plan y superior)
> - Vercel → **Deployment Protection** con `Standard Protection`
> - O simplemente no compartas la URL públicamente

## Cómo habla con el backend

Toda la lógica de red está en `lib/api.ts`. El token de sesión se guarda en `sessionStorage`.

| Función              | Método | Endpoint de Apps Script                                          |
|----------------------|--------|------------------------------------------------------------------|
| `login`              | POST   | body JSON `{ action:'login', pass:'...' }`                        |
| `logout`             | POST   | body JSON `{ action:'logout', token }`                            |
| `changePassword`     | POST   | body JSON `{ action:'changePassword', token, current, next }`     |
| `getDashboard`       | GET    | `?action=dashboard&token=...`                                       |
| `getCitas`           | GET    | `?action=citas&token=...`                                           |
| `updateCitaEstado`   | POST   | body JSON `{ action:'updateCitaEstado', token, row, estado }`     |
| `deleteCita`          | POST   | body JSON `{ action:'deleteCita', token, row }`                   |
| `saveSection`        | POST   | body JSON `{ action:'saveSection', token, key, value }`           |

**Nota sobre CORS**: el POST se envía con `Content-Type: text/plain` para evitar el preflight CORS que Apps Script no maneja bien. El backend parsea el body con `JSON.parse()`. Ver `lib/api.ts` para más detalles.

## Estructura

```
aevi-dashboard/
├── app/
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # 'use client' — shell + login + routing
│   └── globals.css             # CSS transplantado del HTML original
├── components/
│   ├── LoginView.tsx           # Pantalla de login
│   ├── Sidebar.tsx             # Navegación lateral
│   ├── Toast.tsx               # Notificaciones
│   ├── SaveButton.tsx          # Botón genérico de guardado
│   └── panels/
│       ├── ResumenPanel.tsx
│       ├── NegocioPanel.tsx
│       ├── ContactoPanel.tsx
│       ├── UbicacionPanel.tsx
│       ├── ServiciosPanel.tsx
│       ├── HorariosPanel.tsx
│       ├── DisponibilidadPanel.tsx
│       ├── ImagenesPanel.tsx
│       ├── CitasPanel.tsx
│       └── AjustesPanel.tsx
├── lib/
│   ├── api.ts                  # Cliente HTTP (fetch a Apps Script)
│   ├── types.ts                # Tipos compartidos
│   └── utils.ts                # Helpers (esc, isoToday, formatMoney, ...)
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
└── vercel.json
```

## Flujo de trabajo

1. Cliente entra a la página pública (`aevi-reservas`) → reserva una cita.
2. La cita aparece en la hoja `Citas` de Google Sheets con estado `pendiente`.
3. Tú abres este panel (`aevi-dashboard`), entras a **Citas**, cambias el estado a `confirmada` o eliminas la cita.
4. Cualquier cambio que hagas en **Servicios**, **Horarios**, **Disponibilidad**, etc., se refleja inmediatamente en la página pública la próxima vez que un cliente la carga.
