import { describe, expect, it } from 'vitest';

import { getVoteLabel, toVoteValue } from '@/utils/vote';

describe('vote utils', () => {
  it('maps vote values to labels', () => {
    expect(getVoteLabel(-1)).toBe('Reject');
    expect(getVoteLabel(2)).toBe('Super Like');
    expect(getVoteLabel(1)).toBe('Like');
  });

  it('maps history filter to vote value', () => {
    expect(toVoteValue('dislike')).toBe(-1);
    expect(toVoteValue('super-like')).toBe(2);
    expect(toVoteValue('like')).toBe(1);
    expect(toVoteValue('all')).toBeNull();
  });
});
