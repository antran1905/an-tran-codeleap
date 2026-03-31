import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { getDogBreeds } from '@/services/dog.api';

vi.mock('@/services/dog.api', () => {
  return {
    getDogBreeds: vi.fn(),
  };
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper(props: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
  }

  return Wrapper;
}

describe('useDogBreedsQuery', () => {
  it('returns success data', async () => {
    vi.mocked(getDogBreeds).mockResolvedValueOnce([
      {
        id: 1,
        name: 'Affenpinscher',
        weight: { metric: '3 - 6' },
        height: { metric: '23 - 29' },
      },
    ]);

    const wrapper = createWrapper();
    const result = renderHook(() => useDogBreedsQuery(), { wrapper });

    await waitFor(() => {
      expect(result.result.current.isSuccess).toBe(true);
    });

    expect(result.result.current.data?.[0]?.name).toBe('Affenpinscher');
  });

  it('returns error state when request fails', async () => {
    vi.mocked(getDogBreeds).mockRejectedValueOnce(new Error('network error'));

    const wrapper = createWrapper();
    const result = renderHook(() => useDogBreedsQuery(), { wrapper });

    await waitFor(() => {
      expect(result.result.current.isError).toBe(true);
    });
  });
});
