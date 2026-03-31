import { describe, expect, it } from 'vitest';
import type { LoaderFunctionArgs } from 'react-router-dom';

import { dogDetailsLoader } from '@/routes/loaders/dog-details.loader';

function buildLoaderArgs(dogId?: string): LoaderFunctionArgs {
  return {
    request: new Request('http://localhost/dogs'),
    params: dogId ? { dogId } : {},
    context: undefined,
  } as unknown as LoaderFunctionArgs;
}

describe('dogDetailsLoader', () => {
  it('redirects to home when dogId param is missing', async () => {
    const result = await dogDetailsLoader(buildLoaderArgs());

    expect(result).toBeInstanceOf(Response);

    if (result instanceof Response) {
      expect(result.headers.get('Location')).toBe('/');
      expect(result.status).toBe(302);
    }
  });

  it('redirects to home when dogId is not a positive integer', async () => {
    const nonIntegerResult = await dogDetailsLoader(buildLoaderArgs('abc'));
    const zeroResult = await dogDetailsLoader(buildLoaderArgs('0'));

    expect(nonIntegerResult).toBeInstanceOf(Response);
    expect(zeroResult).toBeInstanceOf(Response);

    if (nonIntegerResult instanceof Response) {
      expect(nonIntegerResult.headers.get('Location')).toBe('/');
    }

    if (zeroResult instanceof Response) {
      expect(zeroResult.headers.get('Location')).toBe('/');
    }
  });

  it('returns loader data for a valid dogId', async () => {
    const result = await dogDetailsLoader(buildLoaderArgs('12'));

    expect(result).toEqual({ dogId: 12 });
  });
});
