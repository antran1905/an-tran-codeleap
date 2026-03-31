import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BreedMetaPanel } from '@/components/molecules/BreedMetaPanel';

describe('BreedMetaPanel', () => {
  it('renders breed name and capitalized temperament chips', () => {
    render(
      <BreedMetaPanel
        breedName="Affenpinscher"
        temperamentList={['alert', 'high energy', 'loyal']}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Affenpinscher' })).toBeInTheDocument();
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('High Energy')).toBeInTheDocument();
    expect(screen.getByText('Loyal')).toBeInTheDocument();
  });

  it('renders fallback text when temperament list is empty', () => {
    render(
      <BreedMetaPanel
        breedName="Affenpinscher"
        temperamentList={[]}
      />,
    );

    expect(screen.getByText('Unknown temperament')).toBeInTheDocument();
  });
});
