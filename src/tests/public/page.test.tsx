import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(public)/page';

vi.mock('@/shared/components/errorHandler', () => ({ ErrorHandler: () => null }));
vi.mock('@/app/(public)/components/hero', () => ({ Hero: () => null }));
vi.mock('@/app/(public)/components/calendar-matches', () => ({ CalendarMatches: () => null }));
vi.mock('@/app/(public)/components/latest-results', () => ({ LatestResults: () => null }));
vi.mock('@/app/(public)/components/latest-images', () => ({ LatestImages: () => null }));

describe('Tests on <HomePage />', () => {
  test('Should render the home page correctly', async () => {
    const serverComponent = await HomePage({
      searchParams: Promise.resolve({
        'next-matches': undefined,
        'latest-results': undefined,
        'selected-day': undefined,
      }),
    });

    render(serverComponent);

    const title = screen.queryByRole('heading',
      { level: 1 },
    );
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/limefut/i);
  });
});
