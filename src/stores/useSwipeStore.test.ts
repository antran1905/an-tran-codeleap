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

  it('hydrates to zero when persisted value is invalid', () => {
    window.localStorage.setItem(Env.VITE_PROGRESS_STORAGE_KEY, 'not-a-number');

    useSwipeStore.getState().hydrateIndex(10);

    expect(useSwipeStore.getState().currentIndex).toBe(0);
    expect(window.localStorage.getItem(Env.VITE_PROGRESS_STORAGE_KEY)).toBe('0');
  });

  it('clamps setCurrentIndex between zero and maxLength', () => {
    useSwipeStore.getState().setCurrentIndex(-1, 5);
    expect(useSwipeStore.getState().currentIndex).toBe(0);

    useSwipeStore.getState().setCurrentIndex(10, 5);
    expect(useSwipeStore.getState().currentIndex).toBe(5);
  });

  it('advances and retreats index', () => {
    useSwipeStore.getState().setCurrentIndex(0, 5);
    useSwipeStore.getState().advance(5);
    useSwipeStore.getState().advance(5);

    expect(useSwipeStore.getState().currentIndex).toBe(2);

    useSwipeStore.getState().retreat();
    expect(useSwipeStore.getState().currentIndex).toBe(1);
  });

  it('advances to completion when next index passes the last card', () => {
    useSwipeStore.getState().setCurrentIndex(4, 5);
    useSwipeStore.getState().advance(5);

    expect(useSwipeStore.getState().currentIndex).toBe(5);
    expect(window.localStorage.getItem(Env.VITE_PROGRESS_STORAGE_KEY)).toBe('5');
  });

  it('resets progress when advancing with empty list', () => {
    useSwipeStore.getState().setCurrentIndex(3, 5);
    useSwipeStore.getState().advance(0);

    expect(useSwipeStore.getState().currentIndex).toBe(0);
    expect(window.localStorage.getItem(Env.VITE_PROGRESS_STORAGE_KEY)).toBe('0');
  });

  it('does not retreat below zero', () => {
    useSwipeStore.getState().setCurrentIndex(0, 5);
    useSwipeStore.getState().retreat();

    expect(useSwipeStore.getState().currentIndex).toBe(0);
  });

  it('reset sets index to zero and persists it', () => {
    useSwipeStore.getState().setCurrentIndex(4, 5);
    useSwipeStore.getState().reset();

    expect(useSwipeStore.getState().currentIndex).toBe(0);
    expect(window.localStorage.getItem(Env.VITE_PROGRESS_STORAGE_KEY)).toBe('0');
  });
});
