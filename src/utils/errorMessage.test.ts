import axios, { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { toQueryErrorMessage } from '@/utils/errorMessage';

function createAxiosError(options: {
  status?: number;
  data?: unknown;
}): AxiosError {
  return new AxiosError(
    'Request failed',
    undefined,
    undefined,
    undefined,
    {
      data: options.data,
      status: options.status ?? 500,
      statusText: 'Error',
      headers: {},
      config: {
        headers: axios.AxiosHeaders.from({}),
      },
    },
  );
}

describe('toQueryErrorMessage', () => {
  it('returns friendly detail for network issues', () => {
    const error = new AxiosError('Network Error');

    const result = toQueryErrorMessage({
      error,
      fallbackMessage: 'Unable to load data.',
    });

    expect(result.message).toBe('Unable to load data.');
    expect(result.details).toBe('Unable to reach the dog service. Please check your connection and retry.');
  });

  it('maps 429 to a retry hint', () => {
    const result = toQueryErrorMessage({
      error: createAxiosError({
        status: 429,
      }),
      fallbackMessage: 'Unable to load data.',
    });

    expect(result.details).toBe('You are going too fast. Please wait a moment before retrying.');
  });

  it('uses api message when provided', () => {
    const result = toQueryErrorMessage({
      error: createAxiosError({
        status: 400,
        data: {
          message: 'Breed data is temporarily unavailable.',
        },
      }),
      fallbackMessage: 'Unable to load data.',
    });

    expect(result.details).toBe('Breed data is temporarily unavailable.');
  });

  it('falls back for unknown errors', () => {
    const result = toQueryErrorMessage({
      error: {
        issue: 'unknown',
      },
      fallbackMessage: 'Unable to load data.',
    });

    expect(result.details).toBe('Please try again in a moment.');
  });
});
