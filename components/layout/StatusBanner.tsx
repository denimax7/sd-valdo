'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/locales';
import type { Inscriptions } from '@/lib/schemas';

interface Props {
  data: Inscriptions;
  locale: Locale;
}

const COOKIE_KEY = 'sdv.banner.dismissed';
const COOKIE_DAYS = 7;

function setCookie(key: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${value};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

export function StatusBanner({ data, locale }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Non mostrar se xa foi descartado (só para o estado ABERTO)
    if (data.open && getCookie(COOKIE_KEY) === 'true') return;
    setVisible(true);
  }, [data.open]);

  if (!visible) return null;

  const text = data.open ? data.textOpen[locale] : data.textClosed[locale];
  const isOpen = data.open;

  function dismiss() {
    setVisible(false);
    if (isOpen) setCookie(COOKIE_KEY, 'true', COOKIE_DAYS);
  }

  const content = (
    <div
      className={cn(
        'relative flex min-h-[32px] w-full items-center justify-center gap-3 px-4 py-1.5 text-sm md:min-h-[36px]',
        isOpen ? 'bg-[#16A34A]' : 'bg-[#DC2626]',
        'text-white',
      )}
      role="status"
      aria-live="polite"
    >
      {/* Indicador pulsante */}
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            isOpen ? 'bg-white' : 'bg-white/70',
          )}
        />
      </span>

      <Users className="hidden h-4 w-4 shrink-0 md:block" aria-hidden />

      <span className="font-kicker text-xs font-bold uppercase tracking-wider leading-tight text-center sm:text-sm">
        {text}
      </span>

      {isOpen && (
        <span className="hidden rounded border border-white/40 bg-white/20 px-2.5 py-0.5 font-kicker text-xs font-bold uppercase tracking-wider hover:bg-white/30 md:inline-block">
          {data.ctaLabel[locale]}
        </span>
      )}

      {/* Botón pechar — só no estado aberto */}
      {isOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Pechar aviso"
          className="absolute right-3 flex h-8 w-8 items-center justify-center rounded opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );

  if (isOpen) {
    return (
      <a
        href={data.formUrl.startsWith('http') ? data.formUrl : `/${locale}/club/contacto`}
        target={data.formUrl.startsWith('http') ? '_blank' : undefined}
        rel={data.formUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        aria-label={`${text} — ${data.ctaLabel[locale]}`}
      >
        {content}
      </a>
    );
  }

  // Estado pechado: non é clicable, só informativo
  return <div className="w-full">{content}</div>;
}
