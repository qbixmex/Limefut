import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { GalleriesView } from '@/app/admin/galerias/(components)/galleries-view';

const shouldSuspend = vi.hoisted(() => ({ value: false }));

let tableProps: Record<string, unknown> | undefined;

vi.mock('@/app/admin/galerias/(components)/galleries-table', () => ({
  GalleriesTable: (props: Record<string, unknown>) => {
    tableProps = props;

    if (shouldSuspend.value) {
      use(new Promise(() => {}));
    }

    return <div data-testid="galleries-table" />;
  },
}));

vi.mock('@/app/admin/galerias/(components)/galleries-table-skeleton', () => ({
  GalleriesTableSkeleton: () => <div data-testid="galleries-table-skeleton" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <GalleriesView />', () => {
  beforeEach(() => {
    shouldSuspend.value = false;
    tableProps = undefined;
  });

  const renderComponent = async (searchParams: SearchParams = {}) => {
    const ServerComponent = await GalleriesView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <GalleriesTable /> when not suspended', async () => {
    await renderComponent();

    const galleriesTable = screen.getByTestId('galleries-table');

    expect(galleriesTable).toBeInTheDocument();
  });

  test('Should pass the query and current page to <GalleriesTable />', async () => {
    await renderComponent({ query: 'apertura', page: '2' });

    expect(tableProps).toEqual(
      expect.objectContaining({ query: 'apertura', currentPage: '2' }),
    );
  });

  test('Should render the skeleton while <GalleriesTable /> is loading', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await GalleriesView({
      searchParams: Promise.resolve({}),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('galleries-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
