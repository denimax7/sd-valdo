import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-xs font-kicker uppercase tracking-wider font-bold',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-900',
        success: 'bg-success/15 text-success',
        danger: 'bg-danger/15 text-danger',
        warning: 'bg-warning/15 text-warning',
        accent: 'bg-accent text-accent-foreground',
        outline: 'border border-border text-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
