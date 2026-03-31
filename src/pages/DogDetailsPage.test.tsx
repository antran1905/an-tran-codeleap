import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateDogFavouriteMutation } from '@/hooks/useCreateDogFavouriteMutation';
import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { useVoteDogMutation } from '@/hooks/useVoteDogMutation';
import { DogDetailsPage } from '@/pages/DogDetailsPage';
import { useSwipeStore } from '@/stores/useSwipeStore';

const navigateSpy = vi.fn();
const voteMutateSpy = vi.fn();
const favouriteMutateSpy = vi.fn();
const setCurrentIndexSpy = vi.fn();
const showSwipeFeedbackSpy = vi.fn();
const breedsRefetchSpy = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useLoaderData: vi.fn(),
    useParams: vi.fn(),
    useNavigate: vi.fn(() => navigateSpy),
  };
});

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

vi.mock('@/hooks/useCreateDogFavouriteMutation', () => {
  return {
    useCreateDogFavouriteMutation: vi.fn(),
  };
});

vi.mock('@/stores/useSwipeStore', () => {
  return {
    useSwipeStore: vi.fn(),
  };
});

vi.mock('@/components/organisms/DogDetailsPanel', () => {
  return {
    DogDetailsPanel: (props: { onVote: (value: 1 | -1 | 2) => void }) => {
      return (
        <button type="button" onClick={() => props.onVote(1)}>
          Trigger Vote
        </button>
      );
    },
  };
});

describe('DogDetailsPage', () => {
  beforeEach(async () => {
    navigateSpy.mockReset();
    voteMutateSpy.mockReset();
    favouriteMutateSpy.mockReset();
    setCurrentIndexSpy.mockReset();
    showSwipeFeedbackSpy.mockReset();
    breedsRefetchSpy.mockReset();

    const reactRouterDom = await import('react-router-dom');

    vi.mocked(reactRouterDom.useLoaderData).mockReturnValue({
      dogId: 2,
    } as ReturnType<typeof reactRouterDom.useLoaderData>);
    vi.mocked(reactRouterDom.useParams).mockReturnValue({
      dogId: '2',
    } as ReturnType<typeof reactRouterDom.useParams>);

    vi.mocked(useSwipeStore).mockImplementation((selector) => {
      return selector({
        currentIndex: 0,
        progressSaveSignal: 0,
        lastSavedIndex: 0,
        swipeFeedbackSignal: 0,
        lastSwipeFeedbackValue: null,
        setCurrentIndex: setCurrentIndexSpy,
        hydrateIndex: vi.fn(),
        advance: vi.fn(),
        retreat: vi.fn(),
        reset: vi.fn(),
        showSwipeFeedback: showSwipeFeedbackSpy,
      } as Parameters<typeof selector>[0]);
    });

    vi.mocked(useVoteDogMutation).mockReturnValue({
      mutate: voteMutateSpy,
    } as unknown as ReturnType<typeof useVoteDogMutation>);

    vi.mocked(useCreateDogFavouriteMutation).mockReturnValue({
      mutate: favouriteMutateSpy,
    } as unknown as ReturnType<typeof useCreateDogFavouriteMutation>);
  });

  it('advances feed index and navigates home after voting from details', async () => {
    const user = userEvent.setup();

    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Breed 1',
          weight: { metric: '10 - 11' },
          height: { metric: '30 - 31' },
          reference_image_id: 'img-1',
        },
        {
          id: 2,
          name: 'Breed 2',
          weight: { metric: '12 - 13' },
          height: { metric: '32 - 33' },
          reference_image_id: 'img-2',
        },
        {
          id: 3,
          name: 'Breed 3',
          weight: { metric: '14 - 15' },
          height: { metric: '34 - 35' },
        },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: breedsRefetchSpy,
    } as unknown as ReturnType<typeof useDogBreedsQuery>);

    render(<DogDetailsPage />);

    await user.click(screen.getByRole('button', { name: 'Trigger Vote' }));

    expect(voteMutateSpy).toHaveBeenCalledWith({
      imageId: 'img-2',
      value: 1,
    });
    expect(favouriteMutateSpy).toHaveBeenCalledWith({
      imageId: 'img-2',
    });
    expect(setCurrentIndexSpy).toHaveBeenCalledWith(2, 2);
    expect(showSwipeFeedbackSpy).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('still navigates home when breed has no image id', async () => {
    const user = userEvent.setup();

    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [
        {
          id: 2,
          name: 'Breed 2',
          weight: { metric: '12 - 13' },
          height: { metric: '32 - 33' },
        },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: breedsRefetchSpy,
    } as unknown as ReturnType<typeof useDogBreedsQuery>);

    render(<DogDetailsPage />);

    await user.click(screen.getByRole('button', { name: 'Trigger Vote' }));

    expect(voteMutateSpy).not.toHaveBeenCalled();
    expect(favouriteMutateSpy).not.toHaveBeenCalled();
    expect(setCurrentIndexSpy).not.toHaveBeenCalled();
    expect(showSwipeFeedbackSpy).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('shows retryable error state when breed query fails', async () => {
    const user = userEvent.setup();

    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Service unavailable'),
      refetch: breedsRefetchSpy,
    } as unknown as ReturnType<typeof useDogBreedsQuery>);

    render(<DogDetailsPage />);

    expect(screen.getByText('Unable to load breed details')).toBeInTheDocument();
    expect(screen.getByText('Breed details are unavailable right now.')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(breedsRefetchSpy).toHaveBeenCalled();
  });

  it('sends users back to deck when dog id is invalid', async () => {
    const user = userEvent.setup();
    const reactRouterDom = await import('react-router-dom');

    vi.mocked(reactRouterDom.useLoaderData).mockReturnValue({
      dogId: 0,
    } as ReturnType<typeof reactRouterDom.useLoaderData>);
    vi.mocked(reactRouterDom.useParams).mockReturnValue({
      dogId: '0',
    } as ReturnType<typeof reactRouterDom.useParams>);

    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: breedsRefetchSpy,
    } as unknown as ReturnType<typeof useDogBreedsQuery>);

    render(<DogDetailsPage />);

    expect(screen.getByText('Invalid breed link')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to deck' }));

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
