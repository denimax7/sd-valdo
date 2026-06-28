'use client';
import { useEffect, useState } from 'react';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';

interface Props {
  to: string; // ISO datetime
  locale: Locale;
}

function calc(target: number) {
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

export function Countdown({ to, locale }: Props) {
  const t = createT(locale);
  const target = new Date(to).getTime();
  // Renderizamos un valor estable no servidor e actualizamos no cliente
  const [parts, setParts] = useState(() => calc(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setParts(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: Array<[number, string]> = [
    [parts.d, t('home.next_match.days')],
    [parts.h, t('home.next_match.hours')],
    [parts.m, t('home.next_match.minutes')],
    [parts.s, t('home.next_match.seconds')],
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-4"
      aria-live="polite"
      aria-atomic="true"
      suppressHydrationWarning
    >
      {cells.map(([val, label], i) => (
        <div key={i} className="flex flex-col items-center rounded bg-accent px-2 py-3 text-white sm:px-4 sm:py-4">
          <span className="font-mono tabular text-3xl font-bold sm:text-5xl">
            {mounted ? String(val).padStart(2, '0') : '--'}
          </span>
          <span className="font-kicker text-[10px] uppercase tracking-wider text-white/70 sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
