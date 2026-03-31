import { fireEvent, render, screen } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DogDetailsPanel } from '@/components/organisms/DogDetailsPanel';

interface MockDogCardStackProps {
  metadata: React.ReactNode;
  queuedSwipeValue: -1 | 1 | 2 | null;
  onQueuedSwipeHandled: () => void;
  onSwipe: (value: -1 | 1 | 2) => void;
}

interface MockSwipeActionBarProps {
  disabled?: boolean;
  onReject: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

vi.mock('@/components/organisms/DogCardStack', () => ({
  DogCardStack: (props: MockDogCardStackProps) => (
    <div>
      <div data-testid="queued-value">{String(props.queuedSwipeValue)}</div>
      {props.metadata}
      <button
        type="button"
        onClick={() => props.onSwipe(props.queuedSwipeValue ?? 1)}
      >
        Trigger Swipe
      </button>
      <button
        type="button"
        onClick={props.onQueuedSwipeHandled}
      >
        Mark Swipe Handled
      </button>
    </div>
  ),
}));

vi.mock('@/components/molecules/SwipeActionBar', () => ({
  SwipeActionBar: (props: MockSwipeActionBarProps) => (
    <div>
      <button type="button" onClick={props.onReject} disabled={props.disabled}>
        Reject
      </button>
      <button type="button" onClick={props.onLike} disabled={props.disabled}>
        Like
      </button>
      <button type="button" onClick={props.onSuperLike} disabled={props.disabled}>
        Super Like
      </button>
    </div>
  ),
}));

describe('DogDetailsPanel', () => {
  it('renders required detail fields', () => {
    render(
      <DogDetailsPanel
        breed={{
          id: 1,
          name: 'Affenpinscher',
          weight: { metric: '3 - 6' },
          height: { metric: '23 - 29' },
          bred_for: 'Small rodent hunting',
          breed_group: 'Toy',
          life_span: '10 - 12 years',
          temperament: 'Stubborn, Curious',
          image: { id: '1', url: 'https://example.com/dog.jpg' },
        }}
        onVote={() => undefined}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Affenpinscher' })).toBeInTheDocument();
    expect(screen.getByText('Breed For -', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Breed Group -', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Weight (Metric) -', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Height (Metric) -', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Life Span -', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Temperament -', { exact: false })).toBeInTheDocument();
  });

  it('queues swipe actions, prevents duplicate queue, and reports swipe value', () => {
    const onVote = vi.fn();

    render(
      <DogDetailsPanel
        breed={{
          id: 2,
          name: 'Basenji',
          weight: { metric: '9 - 11' },
          height: { metric: '41 - 43' },
          temperament: 'Intelligent',
        }}
        onVote={onVote}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(screen.getByTestId('queued-value')).toHaveTextContent('-1');

    fireEvent.click(screen.getByRole('button', { name: 'Super Like' }));
    expect(screen.getByTestId('queued-value')).toHaveTextContent('-1');

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Swipe' }));
    expect(onVote).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByRole('button', { name: 'Mark Swipe Handled' }));
    expect(screen.getByTestId('queued-value')).toHaveTextContent('null');

    fireEvent.click(screen.getByRole('button', { name: 'Super Like' }));
    expect(screen.getByTestId('queued-value')).toHaveTextContent('2');
  });
});
