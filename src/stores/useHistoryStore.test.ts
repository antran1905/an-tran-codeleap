import { beforeEach, describe, expect, it } from 'vitest';

import { useHistoryStore } from '@/stores/useHistoryStore';

describe('useHistoryStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useHistoryStore.setState({ entries: [], filter: 'all' });
  });

  it('appends and removes entries', () => {
    useHistoryStore.getState().appendEntry({
      id: '1',
      breedId: 1,
      breedName: 'Affenpinscher',
      imageUrl: null,
      imageId: null,
      value: 1,
      createdAt: new Date().toISOString(),
    });

    expect(useHistoryStore.getState().entries).toHaveLength(1);

    const removed = useHistoryStore.getState().removeLastEntry();

    expect(removed?.breedName).toBe('Affenpinscher');
    expect(useHistoryStore.getState().entries).toHaveLength(0);
  });
});
