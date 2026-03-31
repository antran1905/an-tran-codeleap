import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DogDetailsPanel } from '@/components/organisms/DogDetailsPanel';

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
      />,
    );

    expect(screen.getByRole('heading', { name: 'Affenpinscher' })).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Weight (Metric)')).toBeInTheDocument();
    expect(screen.getByText('Height (Metric)')).toBeInTheDocument();
    expect(screen.getByText('Bred For')).toBeInTheDocument();
    expect(screen.getByText('Breed Group')).toBeInTheDocument();
    expect(screen.getByText('Life Span')).toBeInTheDocument();
    expect(screen.getByText('Temperament')).toBeInTheDocument();
  });
});
