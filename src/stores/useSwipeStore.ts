import { create } from 'zustand';

import { Env } from '@/Env';
import type { VoteValue } from '@/interfaces/vote.interface';
import { getStorageItem, setStorageItem } from '@/utils/local-storage';

/**
 * Swipe progress lives in localStorage so refresh restores deck position.
 * Indices are 0..maxLength inclusive: `maxLength` means the user finished the list
 * (no breed at that index), so `clampIndex` allows values up to `maxLength`.
 */
interface SwipeStoreState {
  currentIndex: number;
  /** Incremented only when persistence succeeds; UI can subscribe for save confirmation. */
  progressSaveSignal: number;
  lastSavedIndex: number;
  swipeFeedbackSignal: number;
  lastSwipeFeedbackValue: VoteValue | null;
  setCurrentIndex: (nextIndex: number, maxLength: number) => void;
  hydrateIndex: (maxLength: number) => void;
  advance: (maxLength: number) => void;
  retreat: () => void;
  reset: () => void;
  showSwipeFeedback: (value: VoteValue) => void;
}

function clampIndex(value: number, maxLength: number): number {
  // maxLength is a valid index: it represents "past the last item" after the final swipe.
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

function persistProgress(nextIndex: number): boolean {
  return setStorageItem(Env.VITE_PROGRESS_STORAGE_KEY, String(nextIndex));
}

export const useSwipeStore = create<SwipeStoreState>((set, get) => ({
  currentIndex: 0,
  progressSaveSignal: 0,
  lastSavedIndex: 0,
  swipeFeedbackSignal: 0,
  lastSwipeFeedbackValue: null,
  setCurrentIndex: (nextIndex, maxLength) => {
    const safeIndex = clampIndex(nextIndex, maxLength);
    const didPersist = persistProgress(safeIndex);

    set((state) => {
      return {
        currentIndex: safeIndex,
        progressSaveSignal: didPersist
          ? state.progressSaveSignal + 1
          : state.progressSaveSignal,
        lastSavedIndex: didPersist ? safeIndex : state.lastSavedIndex,
      };
    });
  },
  hydrateIndex: (maxLength) => {
    const rawValue = getStorageItem(Env.VITE_PROGRESS_STORAGE_KEY);
    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      persistProgress(0);
      set({ currentIndex: 0 });
      return;
    }

    // Shorter breed lists would otherwise point past the end; clamp and rewrite storage.
    const safeIndex = clampIndex(parsedValue, maxLength);
    persistProgress(safeIndex);
    set({ currentIndex: safeIndex });
  },
  advance: (maxLength) => {
    const nextIndex = get().currentIndex + 1;

    if (maxLength <= 0) {
      const didPersist = persistProgress(0);
      set((state) => {
        return {
          currentIndex: 0,
          progressSaveSignal: didPersist
            ? state.progressSaveSignal + 1
            : state.progressSaveSignal,
          lastSavedIndex: didPersist ? 0 : state.lastSavedIndex,
        };
      });
      return;
    }

    // After the last breed (index maxLength - 1), land on maxLength as the completed state.
    if (nextIndex > maxLength - 1) {
      const didPersist = persistProgress(maxLength);
      set((state) => {
        return {
          currentIndex: maxLength,
          progressSaveSignal: didPersist
            ? state.progressSaveSignal + 1
            : state.progressSaveSignal,
          lastSavedIndex: didPersist ? maxLength : state.lastSavedIndex,
        };
      });
      return;
    }

    const didPersist = persistProgress(nextIndex);
    set((state) => {
      return {
        currentIndex: nextIndex,
        progressSaveSignal: didPersist
          ? state.progressSaveSignal + 1
          : state.progressSaveSignal,
        lastSavedIndex: didPersist ? nextIndex : state.lastSavedIndex,
      };
    });
  },
  retreat: () => {
    const previousIndex = get().currentIndex - 1;
    const safeIndex = previousIndex < 0 ? 0 : previousIndex;

    const didPersist = persistProgress(safeIndex);
    set((state) => {
      return {
        currentIndex: safeIndex,
        progressSaveSignal: didPersist
          ? state.progressSaveSignal + 1
          : state.progressSaveSignal,
        lastSavedIndex: didPersist ? safeIndex : state.lastSavedIndex,
      };
    });
  },
  reset: () => {
    const didPersist = persistProgress(0);
    set((state) => {
      return {
        currentIndex: 0,
        progressSaveSignal: didPersist
          ? state.progressSaveSignal + 1
          : state.progressSaveSignal,
        lastSavedIndex: didPersist ? 0 : state.lastSavedIndex,
      };
    });
  },
  showSwipeFeedback: (value) => {
    // Monotonic signal + last value lets listeners run effects on every swipe, even same vote twice.
    set((state) => {
      return {
        swipeFeedbackSignal: state.swipeFeedbackSignal + 1,
        lastSwipeFeedbackValue: value,
      };
    });
  },
}));
