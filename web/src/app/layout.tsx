import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutriDrive - Drive intelligent sport & nutrition',
  description: 'Choisis tes recettes, les courses se font toutes seules.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* Anti-flash : applique le thème avant que React hydrate */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
