interface StatRowProps {
  label: string;
  value?: string;
}

export function StatRow(props: StatRowProps) {
  const value = props.value && props.value.trim().length > 0 ? props.value : 'N/A';

  return (
    <div className="grid grid-cols-[9rem_1fr] items-start gap-3 rounded-xl border border-border/45 bg-background/25 px-3 py-2.5 text-sm backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{props.label}</p>
      <p className="text-right text-foreground">{value}</p>
    </div>
  );
}
