import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import PlayoffsPage from '@/app/admin/liguilla/page';

const shouldSuspend = vi.hoisted(() => ({ value: false }));

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/liguilla/(components)/create-playoff', () => ({
  CreatePlayoff: () => <div data-testid="create-playoff" />,
}));

vi.mock('@/app/admin/liguilla/(components)/clear-filters', () => ({
  ClearFilters: () => <div data-testid="clear-filters" />,
}));

vi.mock('@/app/admin/liguilla/(components)/playoffs-table-skeleton', () => ({
  PlayoffsTableSkeleton: () => <div data-testid="playoffs-table-skeleton" />,
}));

vi.mock('@/app/admin/liguilla/playoffs-view', () => ({
  PlayoffsView: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="playoffs-view" />;
  },
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on PlayoffsPage', () => {
  beforeEach(() => {
    shouldSuspend.value = false;
  });

  const renderPage = async () => {
    const ServerComponent = await PlayoffsPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    return render(ServerComponent);
  };

  test('Should render heading', async () => {
    await renderPage();

    const heading = screen.getByText(/liguilla/i);

    expect(heading).toBeInTheDocument();
  });

  test('Should render <Search /> component', async () => {
    await renderPage();

    const search = screen.getByTestId('search-component');

    expect(search).toBeInTheDocument();
  });

  test('Should render <ClearFilters /> component', async () => {
    await renderPage();

    const clearFilters = screen.getByTestId('clear-filters');

    expect(clearFilters).toBeInTheDocument();
  });

  test('Should render <CreatePlayoff /> component', async () => {
    await renderPage();

    const createPlayoff = screen.getByTestId('create-playoff');

    expect(createPlayoff).toBeInTheDocument();
  });

  test('Should render <PlayoffsView /> component', async () => {
    await renderPage();

    const playoffsView = screen.getByTestId('playoffs-view');

    expect(playoffsView).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await PlayoffsPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('playoffs-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
