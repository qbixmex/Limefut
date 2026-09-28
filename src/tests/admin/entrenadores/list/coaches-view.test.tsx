import { use, act } from 'react';
import { CoachesPageView } from '@/app/admin/entrenadores/coaches-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/entrenadores/(components)/coaches-table-skeleton', () => ({
  CoachesTableSkeleton: () => <div data-testid="coaches-table-skeleton" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/coaches-table', () => ({
  CoachesTable: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="coaches-table" />;
  },
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on CoachesPageView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await CoachesPageView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('coaches-table')).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    const ServerComponent = await CoachesPageView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    expect(screen.getByTestId('coaches-table-skeleton')).toBeInTheDocument();
  });
});
