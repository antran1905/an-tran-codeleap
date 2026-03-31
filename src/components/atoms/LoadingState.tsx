import { cn } from '@/lib/utils';

interface LoadingStateProps {
  title?: string;
  message?: string;
  hint?: string;
  compact?: boolean;
}

export function LoadingState(props: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-2xl border border-border bg-card px-4 text-left',
        props.compact ? 'py-3' : 'min-h-40 py-8',
      )}
    >
      <div className="mx-auto flex max-w-xl items-start justify-center gap-3">
        <span
          aria-hidden
          className={cn(
            'mt-0.5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary',
            props.compact ? 'h-4 w-4' : 'h-5 w-5',
          )}
        />
        <div>
          <p className={cn('font-semibold text-foreground', props.compact ? 'text-xs' : 'text-sm')}>
            {props.title ?? 'Loading'}
          </p>
          <p className={cn('mt-1 text-muted-foreground', props.compact ? 'text-xs' : 'text-sm')}>
            {props.message ?? 'Please wait while we fetch the latest data.'}
          </p>
          {props.hint ? <p className="mt-1 text-xs text-muted-foreground">{props.hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
