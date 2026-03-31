import type * as React from 'react';

interface ErrorStateProps {
  message: string;
  action?: React.ReactNode;
}

export function ErrorState(props: ErrorStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/40 bg-card px-4 py-8 text-center">
      <p className="text-sm text-destructive">{props.message}</p>
      {props.action}
    </div>
  );
}
