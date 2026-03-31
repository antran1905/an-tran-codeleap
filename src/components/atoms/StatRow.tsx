import { cn } from '@/lib/utils';
import type * as React from 'react';

interface StatRowProps {
  label: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StatRow(props: StatRowProps) {
  const value = props.value && props.value.trim().length > 0 ? props.value : 'N/A';

  return (
    <div
      className={cn(
        'rounded-lg border border-border/45 bg-background/25 px-3 py-2 text-sm backdrop-blur-sm',
        props.className,
      )}
      style={props.style}
    >
      <p className="text-foreground">
        <span className="font-semibold text-primary">{props.label} - </span>
        <span>{value}</span>
      </p>
    </div>
  );
}
