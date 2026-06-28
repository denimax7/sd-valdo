import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  src?: string;
  alt: string;
  shortName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { px: 32, cls: 'h-8 w-8 text-[10px]' },
  md: { px: 48, cls: 'h-12 w-12 text-xs' },
  lg: { px: 72, cls: 'h-16 w-16 sm:h-18 sm:w-18 text-sm' },
  xl: { px: 112, cls: 'h-24 w-24 sm:h-28 sm:w-28 text-base' },
} as const;

export function TeamCrest({ src, alt, shortName, size = 'md', className }: Props) {
  const s = sizeMap[size];
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={s.px}
        height={s.px}
        className={cn('object-contain', s.cls, className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'flex items-center justify-center rounded bg-accent text-white font-display tracking-wider',
        s.cls,
        className,
      )}
    >
      {shortName?.slice(0, 3).toUpperCase() ?? '?'}
    </div>
  );
}
