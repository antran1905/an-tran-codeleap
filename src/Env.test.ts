import { describe, expect, it } from 'vitest';

import { parseEnv } from '@/Env';

describe('parseEnv', () => {
  it('parses valid env values', () => {
    const result = parseEnv({
      VITE_APP_NAME: 'DogFinder',
      VITE_DOG_API_BASE_URL: 'https://api.thedogapi.com/v1',
      VITE_DOG_API_KEY: 'secret-key',
      VITE_PROGRESS_STORAGE_KEY: 'dogfinder.progress.v1',
    });

    expect(result.VITE_APP_NAME).toBe('DogFinder');
    expect(result.VITE_DOG_API_BASE_URL).toBe('https://api.thedogapi.com/v1');
  });

  it('throws when required values are missing', () => {
    expect(() => {
      parseEnv({
        VITE_APP_NAME: 'DogFinder',
        VITE_DOG_API_BASE_URL: 'https://api.thedogapi.com/v1',
        VITE_DOG_API_KEY: '',
        VITE_PROGRESS_STORAGE_KEY: 'dogfinder.progress.v1',
      });
    }).toThrow();
  });
});
