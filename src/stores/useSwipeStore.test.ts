import { beforeEach, describe, expect, it } from 'vitest';

import { Env } from '@/Env';
import { useSwipeStore } from '@/stores/useSwipeStore';

describe('useSwipeStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useSwipeStore.setState({ currentIndex: 0 });
  });

  it('hydrates from localStorage progress', () => {
    window.localStorage.setItem(Env.VITE_PROGRESS_STORAGE_KEY, '3');

    useSwipeStore.getState().hydrateIndex(10);

    expect(useSwipeStore.getState().currentIndex).toBe(3);
  });

  it('advances and retreats index', () => {
    useSwipeStore.getState().setCurrentIndex(0, 5);
    useSwipeStore.getState().advance(5);
    useSwipeStore.getState().advance(5);

    expect(useSwipeStore.getState().currentIndex).toBe(2);

    useSwipeStore.getState().retreat();
    expect(useSwipeStore.getState().currentIndex).toBe(1);
  });
});
