import { render, screen } from '@testing-library/react';
import { PlayoffsMatchesPage } from '@/app/admin/liguilla/[playoff_id]/encuentros/page';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';

const createMatchProps = vi.hoisted(() => ({ current: undefined as unknown }));
const viewProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/clear-filters', () => ({
  ClearFilters: () => <div data-testid="clear-filters" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/create-match', () => ({
  CreateMatch: (props: unknown) => {
    createMatchProps.current = props;
    return <div data-testid="create-match" />;
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/playoff-matches-view', () => ({
  PlayoffsMatchesView: (props: unknown) => {
    viewProps.current = props;
    return <div data-testid="playoff-matches-view" />;
  },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

type SearchParams = {
  query?: string;
  page?: string;
  status?: MATCH_STATUS_TYPE;
  'sort-match-date'?: 'asc' | 'desc';
};

describe('Tests on <PlayoffsMatchesPage />', () => {
  beforeEach(() => {
    createMatchProps.current = undefined;
    viewProps.current = undefined;
  });

  const renderPage = (searchParams: SearchParams = {}) => {
    const params = Promise.resolve({ playoff_id: playoffId });
    return render(
      <PlayoffsMatchesPage
        params={params}
        searchParams={Promise.resolve(searchParams)}
      />,
    );
  };

  test('Should render the heading', () => {
    renderPage();

    expect(screen.getByText(/encuentros de liguilla/i)).toBeInTheDocument();
  });

  test('Should render <Search />', () => {
    renderPage();

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
  });

  test('Should render <ClearFilters />', () => {
    renderPage();

    expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
  });

  test('Should render <CreateMatch />', () => {
    renderPage();

    const createMatch = screen.getByTestId('create-match');

    expect(createMatch).toBeInTheDocument();
  });

  test('Should render <PlayoffsMatchesView />', () => {
    renderPage();

    const playoffMatchesView = screen.getByTestId('playoff-matches-view');

    expect(playoffMatchesView).toBeInTheDocument();
  });

  test('Should pass the playoff id promise to the child components', async () => {
    renderPage();

    const createMatch = createMatchProps.current as {
      playoffIdPromise: Promise<string>;
    };
    const view = viewProps.current as { playoffIdPromise: Promise<string> };

    await expect(createMatch.playoffIdPromise).resolves.toBe(playoffId);
    await expect(view.playoffIdPromise).resolves.toBe(playoffId);
  });

  test('Should forward the search params promise to <PlayoffsMatchesView />', async () => {
    const searchParams = { query: 'atlas', page: '2' };
    renderPage(searchParams);

    const view = viewProps.current as {
      searchParams: Promise<SearchParams>;
    };

    await expect(view.searchParams).resolves.toEqual(searchParams);
  });
});
