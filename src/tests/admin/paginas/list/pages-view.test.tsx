import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { CustomPagesView } from '@/app/admin/paginas/(components)/custom-pages.view';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/paginas/(components)/pages-table-skeleton', () => ({
  PagesTableSkeleton: () => <div data-testid="pages-table-skeleton" />,
}));

vi.mock('@/app/admin/paginas/(components)/pages-table', () => ({
  PagesTable: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => {}));
    }
    return <div data-testid="pages-table" />;
  },
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on CustomPagesView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render the table correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await CustomPagesView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('pages-table')).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    const ServerComponent = await CustomPagesView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    expect(screen.getByTestId('pages-table-skeleton')).toBeInTheDocument();
  });
});
