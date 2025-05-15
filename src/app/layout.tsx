import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Palavrix - Jogo de Palavras em Português',
  description: 'Descubra a palavra certa em 6 tentativas. Um jogo diário de palavras em português.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
} 