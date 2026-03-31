interface LoadingStateProps {
  message?: string;
}

export function LoadingState(props: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-card px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">{props.message ?? 'Loading...'}</p>
    </div>
  );
}
