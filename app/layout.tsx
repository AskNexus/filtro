import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Filtro — Demo IA',
  description: 'Sistema de respuesta automática con IA para gestión de clientes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
