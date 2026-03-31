import { afterEach, describe, expect, it, vi } from 'vitest';

import { getStorageItem, setStorageItem } from '@/utils/local-storage';

describe('local-storage utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('gets existing storage item', () => {
    window.localStorage.setItem('token', 'abc123');

    const result = getStorageItem('token');

    expect(result).toBe('abc123');
  });

  it('returns null when localStorage getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    const result = getStorageItem('token');

    expect(result).toBeNull();
  });

  it('sets storage item when available', () => {
    const result = setStorageItem('progress', '4');

    expect(result).toBe(true);
    expect(window.localStorage.getItem('progress')).toBe('4');
  });

  it('returns false when localStorage setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(setStorageItem('progress', '4')).toBe(false);
  });
});
