import { cn } from '@/lib/utils';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}: Props) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {kicker && (
        <span className="kicker-line text-primary-700">{kicker}</span>
      )}
      <Tag
        className={cn(
          'text-fluid-h2 leading-[0.95]',
          Tag === 'h1' && 'text-fluid-h1',
          Tag === 'h3' && 'text-fluid-h3',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl text-fluid-body text-muted">{description}</p>
      )}
    </header>
  );
}
