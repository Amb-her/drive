import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutriDrive - Drive intelligent sport & nutrition',
  description: 'Choisis tes recettes, les courses se font toutes seules.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
