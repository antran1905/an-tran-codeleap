import { create } from 'zustand';

import { Env } from '@/Env';
import { getStorageItem, setStorageItem } from '@/utils/local-storage';

interface SwipeStoreState {
  currentIndex: number;
  setCurrentIndex: (nextIndex: number, maxLength: number) => void;
  hydrateIndex: (maxLength: number) => void;
  advance: (maxLength: number) => void;
  retreat: () => void;
  reset: () => void;
}

function clampIndex(value: number, maxLength: number): number {
  if (maxLength <= 0) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > maxLength) {
    return maxLength;
  }

  return value;
}

function persistProgress(nextIndex: number): void {
  setStorageItem(Env.VITE_PROGRESS_STORAGE_KEY, String(nextIndex));
}

export const useSwipeStore = create<SwipeStoreState>((set, get) => ({
  currentIndex: 0,
  setCurrentIndex: (nextIndex, maxLength) => {
    const safeIndex = clampIndex(nextIndex, maxLength);
    persistProgress(safeIndex);
    set({ currentIndex: safeIndex });
  },
  hydrateIndex: (maxLength) => {
    const rawValue = getStorageItem(Env.VITE_PROGRESS_STORAGE_KEY);
    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      persistProgress(0);
      set({ currentIndex: 0 });
      return;
    }

    const safeIndex = clampIndex(parsedValue, maxLength);
    persistProgress(safeIndex);
    set({ currentIndex: safeIndex });
  },
  advance: (maxLength) => {
    const nextIndex = get().currentIndex + 1;

    if (maxLength <= 0) {
      set({ currentIndex: 0 });
      persistProgress(0);
      return;
    }

    if (nextIndex > maxLength - 1) {
      set({ currentIndex: maxLength });
      persistProgress(maxLength);
      return;
    }

    set({ currentIndex: nextIndex });
    persistProgress(nextIndex);
  },
  retreat: () => {
    const previousIndex = get().currentIndex - 1;
    const safeIndex = previousIndex < 0 ? 0 : previousIndex;

    set({ currentIndex: safeIndex });
    persistProgress(safeIndex);
  },
  reset: () => {
    set({ currentIndex: 0 });
    persistProgress(0);
  },
}));
