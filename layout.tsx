import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aevi Wellness · Panel',
  description: 'Panel de administración de reservas y configuración.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
