import { use, act } from 'react';
import { CoachesPageView } from '@/app/admin/entrenadores/coaches-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => <div data-testid="error-handler" />,
}));

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/create-page', () => ({
  CreatePage: () => <div data-testid="create-page" />,
}));

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
    shouldSuspend.value = false;
  });

  test('Should render correctly', async () => {
    const ServerComponent = await CoachesPageView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByText('Entrenadores')).toBeInTheDocument();
    expect(screen.getByTestId('error-handler')).toBeInTheDocument();
    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('create-page')).toBeInTheDocument();
    expect(screen.getByTestId('coaches-table')).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await CoachesPageView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('coaches-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
