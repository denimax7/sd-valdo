'use client';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadIcs } from '@/lib/ics';
import type { Match } from '@/lib/schemas';

interface Props {
  match: Match;
  label: string;
}

export function AddToCalendarButton({ match, label }: Props) {
  return (
    <Button
      type="button"
      variant="outline-dark"
      size="sm"
      onClick={() => downloadIcs(match)}
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
