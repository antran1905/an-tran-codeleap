import { create } from 'zustand';

import { historyStorageKey } from '@/config/storage';
import type { HistoryFilter, SwipeHistoryEntry } from '@/interfaces/swipe-history.interface';
import { getStorageItem, setStorageItem } from '@/utils/local-storage';

interface HistoryStoreState {
  entries: SwipeHistoryEntry[];
  filter: HistoryFilter;
  hydrateHistory: () => void;
  setFilter: (filter: HistoryFilter) => void;
  appendEntry: (entry: SwipeHistoryEntry) => void;
  removeLastEntry: () => SwipeHistoryEntry | null;
}

function persistHistory(entries: SwipeHistoryEntry[]): void {
  setStorageItem(historyStorageKey, JSON.stringify(entries));
}

export const useHistoryStore = create<HistoryStoreState>((set, get) => ({
  entries: [],
  filter: 'all',
  hydrateHistory: () => {
    const rawValue = getStorageItem(historyStorageKey);

    if (!rawValue) {
      set({ entries: [] });
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as SwipeHistoryEntry[];
      set({ entries: Array.isArray(parsed) ? parsed : [] });
    } catch {
      set({ entries: [] });
    }
  },
  setFilter: (filter) => {
    set({ filter });
  },
  appendEntry: (entry) => {
    // Newest-first matches UI lists (history/favourites) without extra sorting on read.
    const nextEntries = [entry, ...get().entries];
    persistHistory(nextEntries);
    set({ entries: nextEntries });
  },
  removeLastEntry: () => {
    const entries = get().entries;

    if (entries.length === 0) {
      return null;
    }

    // `entries[0]` is the most recent swipe; undo removes that head item.
    const nextEntries = entries.slice(1);
    persistHistory(nextEntries);
    set({ entries: nextEntries });

    return entries[0] ?? null;
  },
}));
