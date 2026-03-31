import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from '@/pages/HomePage';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSwipeStore } from '@/stores/useSwipeStore';
import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { useVoteDogMutation } from '@/hooks/useVoteDogMutation';

vi.mock('@/hooks/useDogBreedsQuery', () => {
  return {
    useDogBreedsQuery: vi.fn(),
  };
});

vi.mock('@/hooks/useVoteDogMutation', () => {
  return {
    useVoteDogMutation: vi.fn(),
  };
});

function renderHomePage() {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  const mutateSpy = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    mutateSpy.mockReset();

    useSwipeStore.setState({ currentIndex: 0 });
    useHistoryStore.setState({ entries: [], filter: 'all' });

    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Affenpinscher',
          weight: { metric: '3 - 6' },
          height: { metric: '23 - 29' },
          reference_image_id: 'img-1',
          image: { id: 'img-1', url: 'https://example.com/dog-1.jpg' },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogBreedsQuery>);

    vi.mocked(useVoteDogMutation).mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useVoteDogMutation>);
  });

  it('records like action from button controls', async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(screen.getByRole('button', { name: 'Love' }));

    await waitFor(() => {
      expect(useHistoryStore.getState().entries).toHaveLength(1);
      expect(mutateSpy).toHaveBeenCalledWith({ imageId: 'img-1', value: 1 });
    });
  });
});
