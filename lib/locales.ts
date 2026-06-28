export const LOCALES = ['gl', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'gl';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_LABELS: Record<Locale, string> = {
  gl: 'Galego',
  es: 'Español',
};

export const HREFLANG: Record<Locale, string> = {
  gl: 'gl-ES',
  es: 'es-ES',
};
