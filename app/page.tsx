import type { Metadata } from 'next';
import Script from 'next/script';

// Coa exportación estática (`output: 'export'`) non podemos usar `redirect()`
// do servidor. A redirección canónica faise via `vercel.json` (HTTP 308).
// Esta páxina é unha rede de seguridade client-side:
//   1. Le `localStorage.sdv.locale`.
//   2. Se non hai, usa `navigator.language` (es* → /es; resto → /gl).
//   3. Renderiza tamén un <noscript> con link manual.

export const metadata: Metadata = {
  title: 'S.D. Valdoviño',
  alternates: {
    canonical: 'https://sdvaldovino.gal/gl',
    languages: { gl: '/gl', es: '/es', 'x-default': '/gl' },
  },
  other: {
    // Meta refresh como fallback puro HTML (sen JS)
    refresh: '0; url=/gl',
  },
};

export default function RootRedirect() {
  return (
    <>
      <Script id="locale-redirect" strategy="beforeInteractive">{`
        (function () {
          try {
            var stored = localStorage.getItem('sdv.locale');
            if (stored === 'es' || stored === 'gl') {
              window.location.replace('/' + stored);
              return;
            }
            var lang = (navigator.language || 'gl').toLowerCase();
            window.location.replace(lang.indexOf('es') === 0 ? '/es' : '/gl');
          } catch (e) {
            window.location.replace('/gl');
          }
        })();
      `}</Script>
      <div className="flex min-h-screen-safe items-center justify-center p-8">
        <noscript>
          <a href="/gl" className="font-display text-xl uppercase text-primary underline">
            Ir a S.D. Valdoviño →
          </a>
        </noscript>
      </div>
    </>
  );
}
