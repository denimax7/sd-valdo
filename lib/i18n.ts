import gl from '@/i18n/gl.json';
import es from '@/i18n/es.json';
import type { Locale } from './locales';

type Dict = Record<string, unknown>;

const dicts: Record<Locale, Dict> = { gl: gl as Dict, es: es as Dict };

/**
 * Busca por clave anidada con notación punto. Se non existe a clave,
 * devolve a propia clave para que sexa fácil detectar traducións ausentes
 * durante o desenvolvemento.
 */
export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split('.');
  let cur: unknown = dicts[locale];
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Dict)) {
      cur = (cur as Dict)[p];
    } else {
      return key;
    }
  }
  if (typeof cur !== 'string') return key;
  if (!vars) return cur;
  return cur.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function createT(locale: Locale) {
  return (key: string, vars?: Record<string, string | number>) => t(locale, key, vars);
}
