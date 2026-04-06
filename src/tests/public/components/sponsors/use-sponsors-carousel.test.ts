import { renderHook } from '@testing-library/react';
import { useSponsorsCarousel } from '@/app/(public)/components/sponsors/use-sponsors-carousel';
import { sponsors } from '@/tests/mocks/sponsors';

describe('Test on useSponsorsCarousel hook', () => {
  test('Should return current sponsor', async () => {
    const { result } = renderHook(() => useSponsorsCarousel(sponsors, 1));

    expect(result.current.sponsor).toEqual(sponsors[0]);
  });

  test('Should return return sponsor undefined if sponsors array are empty', async () => {
    const { result } = renderHook(() => useSponsorsCarousel([], 1));

    expect(result.current.sponsor).toBe(undefined);
  });
});
