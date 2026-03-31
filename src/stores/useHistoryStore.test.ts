import { beforeEach, describe, expect, it } from 'vitest';

import { historyStorageKey } from '@/config/storage';
import type { SwipeHistoryEntry } from '@/interfaces/swipe-history.interface';
import { useHistoryStore } from '@/stores/useHistoryStore';

function buildEntry(overrides?: Partial<SwipeHistoryEntry>): SwipeHistoryEntry {
  return {
    id: '1',
    breedId: 1,
    breedName: 'Affenpinscher',
    imageUrl: null,
    imageId: null,
    value: 1,
    createdAt: '2026-03-31T00:00:00.000Z',
    ...overrides,
  };
}

describe('useHistoryStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useHistoryStore.setState({ entries: [], filter: 'all' });
  });

  it('hydrates empty history when storage key is missing', () => {
    useHistoryStore.getState().hydrateHistory();

    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('hydrates history from valid persisted JSON array', () => {
    const persisted = [buildEntry({ id: 'persisted' })];
    window.localStorage.setItem(historyStorageKey, JSON.stringify(persisted));

    useHistoryStore.getState().hydrateHistory();

    expect(useHistoryStore.getState().entries).toEqual(persisted);
  });

  it('hydrates empty history when persisted data is invalid JSON', () => {
    window.localStorage.setItem(historyStorageKey, '{invalid-json');

    useHistoryStore.getState().hydrateHistory();

    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('hydrates empty history when parsed value is not an array', () => {
    window.localStorage.setItem(historyStorageKey, JSON.stringify({ id: 'not-array' }));

    useHistoryStore.getState().hydrateHistory();

    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('sets selected filter', () => {
    useHistoryStore.getState().setFilter('like');

    expect(useHistoryStore.getState().filter).toBe('like');
  });

  it('appends and removes entries', () => {
    useHistoryStore.getState().appendEntry(buildEntry({ id: 'first' }));
    useHistoryStore.getState().appendEntry(buildEntry({ id: 'second' }));

    expect(useHistoryStore.getState().entries.map((entry) => entry.id)).toEqual(['second', 'first']);

    const removed = useHistoryStore.getState().removeLastEntry();

    expect(removed?.id).toBe('second');
    expect(useHistoryStore.getState().entries.map((entry) => entry.id)).toEqual(['first']);
    expect(window.localStorage.getItem(historyStorageKey)).toBe(
      JSON.stringify([buildEntry({ id: 'first' })]),
    );
  });

  it('returns null when removing from empty history', () => {
    const removed = useHistoryStore.getState().removeLastEntry();

    expect(removed).toBeNull();
  });
});
