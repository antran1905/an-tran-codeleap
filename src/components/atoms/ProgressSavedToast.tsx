import { cn } from '@/lib/utils';
import type { VoteValue } from '@/interfaces/vote.interface';

interface ProgressSavedToastProps {
  isVisible: boolean;
  swipeValue: VoteValue | null;
}

interface ToastTone {
  label: string;
  message: string;
  shellClassName: string;
  iconClassName: string;
}

function getToastTone(value: VoteValue | null): ToastTone {
  if (value === -1) {
    return {
      label: 'NOPE',
      message: 'Not a match this time!',
      shellClassName: 'border-destructive/60 bg-destructive text-destructive-foreground shadow-destructive/35',
      iconClassName: 'bg-destructive-foreground/20',
    };
  }

  if (value === 2) {
    return {
      label: 'SUPER',
      message: 'Top pick! Saved to Super Likes.',
      shellClassName: 'border-primary/60 bg-primary text-primary-foreground shadow-primary/35',
      iconClassName: 'bg-primary-foreground/20',
    };
  }

  return {
    label: 'LIKE',
    message: 'Added to your favorites!',
    shellClassName: 'border-success/55 bg-success text-success-foreground shadow-success/35',
    iconClassName: 'bg-success-foreground/20',
  };
}

export function ProgressSavedToast(props: ProgressSavedToastProps) {
  const tone = getToastTone(props.swipeValue);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+3.75rem)] right-3 z-50 flex justify-end sm:top-[calc(env(safe-area-inset-top)+4.25rem)] sm:right-6"
    >
      <div
        data-testid="progress-saved-toast"
        role="status"
        className={cn(
          'relative w-[min(84vw,22rem)] overflow-hidden rounded-2xl border shadow-xl transition-all duration-300',
          tone.shellClassName,
          props.isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-6 opacity-0 scale-95',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-success/0 via-success-foreground/15 to-success/0',
            props.isVisible ? 'animate-[progress-toast-sheen_900ms_ease-out]' : '',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'absolute bottom-0 left-0 h-0.5 w-full bg-success-foreground/70',
            props.isVisible ? 'animate-[progress-toast-bar_1400ms_linear_forwards]' : '',
          )}
        />
        <div className="relative flex items-center gap-3 px-4 py-3">
          <span className={cn('flex h-6 w-6 items-center justify-center rounded-full', tone.iconClassName)}>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 fill-none stroke-current"
            >
              <path
                d="M4 10.5L8 14.2L16 6.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase">
              {tone.label}
            </p>
            <p className="truncate text-xs opacity-90">
              {tone.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
