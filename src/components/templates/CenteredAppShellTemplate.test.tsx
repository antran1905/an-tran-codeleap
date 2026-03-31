import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CenteredAppShellTemplate } from '@/components/templates/CenteredAppShellTemplate';
import { useSwipeStore } from '@/stores/useSwipeStore';

describe('CenteredAppShellTemplate', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useSwipeStore.setState({
      currentIndex: 0,
      progressSaveSignal: 0,
      lastSavedIndex: 0,
      swipeFeedbackSignal: 0,
      lastSwipeFeedbackValue: null,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and hides progress saved toast after index is persisted', () => {
    render(
      <MemoryRouter>
        <CenteredAppShellTemplate>
          <div>Page Content</div>
        </CenteredAppShellTemplate>
      </MemoryRouter>,
    );

    const toast = screen.getByTestId('progress-saved-toast');
    expect(toast).toHaveClass('opacity-0');
    expect(toast).toHaveClass('translate-x-6');

    act(() => {
      useSwipeStore.getState().showSwipeFeedback(2);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText('SUPER')).toBeInTheDocument();
    expect(screen.getByText('Top pick! Saved to Super Likes.')).toBeInTheDocument();
    expect(screen.getByTestId('progress-saved-toast')).toHaveClass('opacity-100');
    expect(screen.getByTestId('progress-saved-toast')).toHaveClass('translate-x-0');

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByTestId('progress-saved-toast')).toHaveClass('opacity-0');
  });
});
