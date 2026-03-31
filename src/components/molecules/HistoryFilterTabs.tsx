import { cn } from '@/lib/utils';
import type { HistoryFilter } from '@/interfaces/swipe-history.interface';

interface HistoryFilterTabsProps {
  value: HistoryFilter;
  onChange: (nextValue: HistoryFilter) => void;
}

interface FilterOption {
  value: HistoryFilter;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'dislike', label: 'Rejects' },
  { value: 'like', label: 'Likes' },
  { value: 'super-like', label: 'Super Likes' },
];

export function HistoryFilterTabs(props: HistoryFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => {
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => props.onChange(option.value)}
            className={cn(
              'rounded-full border border-border px-3 py-1.5 text-sm transition-colors',
              props.value === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
