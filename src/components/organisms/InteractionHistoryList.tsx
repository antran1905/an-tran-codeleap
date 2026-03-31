import { Link } from 'react-router-dom';

import { VoteChip } from '@/components/atoms/VoteChip';
import type { SwipeHistoryEntry } from '@/interfaces/swipe-history.interface';

interface InteractionHistoryListProps {
  entries: SwipeHistoryEntry[];
  emptyMessage: string;
}

export function InteractionHistoryList(props: InteractionHistoryListProps) {
  if (props.entries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {props.emptyMessage}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {props.entries.map((entry) => {
        return (
          <li key={entry.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-foreground">{entry.breedName}</p>
              <VoteChip value={entry.value} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{new Date(entry.createdAt).toLocaleString()}</span>
              {entry.breedId > 0 ? (
                <Link to={`/dogs/${entry.breedId}`} className="text-primary underline-offset-2 hover:underline">
                  View Details
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
