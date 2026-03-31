import type * as React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  action?: React.ReactNode;
}

export function ErrorState(props: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-destructive/40 bg-card px-4 py-8 text-center"
    >
      <div className="flex max-w-xl items-start justify-center gap-3 text-left">
        <span
          aria-hidden
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-sm font-bold text-destructive"
        >
          !
        </span>
        <div>
          <p className="text-sm font-semibold text-destructive">
            {props.title ?? 'Something went wrong'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{props.message}</p>
          {props.details ? (
            <p className="mt-1 text-xs text-muted-foreground">{props.details}</p>
          ) : null}
        </div>
      </div>
      {props.action ? <div className="mt-4">{props.action}</div> : null}
    </div>
  );
}
