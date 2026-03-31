import type * as React from 'react';

import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'default' | 'danger' | 'star' | 'love';
}

export function IconButton(props: IconButtonProps) {
  const toneClass = props.tone === 'danger'
    ? 'border-destructive text-destructive hover:bg-destructive/15'
    : props.tone === 'star'
      ? 'border-primary text-primary hover:bg-primary/15 hover:shadow-lg hover:shadow-primary/45'
      : props.tone === 'love'
        ? 'border-secondary text-secondary hover:bg-secondary/20 hover:shadow-lg hover:shadow-secondary/40'
        : 'border-border text-foreground hover:bg-muted';

  return (
    <button
      type={props.type ?? 'button'}
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      className={cn(
        'inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 bg-background/70 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        toneClass,
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
