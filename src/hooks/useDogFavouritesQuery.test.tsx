import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDogFavouritesQuery } from '@/hooks/useDogFavouritesQuery';
import { getDogFavourites } from '@/services/dog.api';

vi.mock('@/services/dog.api', () => {
  return {
    getDogFavourites: vi.fn(),
  };
});

function createWrapper(options: { queryClient: QueryClient }) {
  function Wrapper(props: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={options.queryClient}>
        {props.children}
      </QueryClientProvider>
    );
  }

  return Wrapper;
}

describe('useDogFavouritesQuery', () => {
  it('refetches when mounted again', async () => {
    vi.mocked(getDogFavourites).mockResolvedValue({
      items: [],
      page: 0,
      limit: 10,
      totalCount: 0,
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const wrapper = createWrapper({
      queryClient,
    });

    const firstRender = renderHook(() => useDogFavouritesQuery({
      page: 0,
      limit: 10,
      order: 'DESC',
    }), {
      wrapper,
    });

    await waitFor(() => {
      expect(firstRender.result.current.isSuccess).toBe(true);
    });
    expect(getDogFavourites).toHaveBeenCalledTimes(1);
    expect(getDogFavourites).toHaveBeenCalledWith({
      page: 0,
      limit: 10,
      order: 'DESC',
    });

    firstRender.unmount();

    renderHook(() => useDogFavouritesQuery({
      page: 0,
      limit: 10,
      order: 'DESC',
    }), {
      wrapper,
    });

    await waitFor(() => {
      expect(getDogFavourites).toHaveBeenCalledTimes(2);
    });
  });
});
