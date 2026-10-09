import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { VideosView } from '@/app/admin/videos/(components)/videos-view';

const shouldSuspend = vi.hoisted(() => ({ value: false }));

let tableProps: Record<string, unknown> | undefined;

vi.mock('@/app/admin/videos/(components)/videos-table', () => ({
  VideosTable: (props: Record<string, unknown>) => {
    tableProps = props;

    if (shouldSuspend.value) {
      use(new Promise(() => {}));
    }

    return <div data-testid="videos-table" />;
  },
}));

vi.mock('@/app/admin/videos/(components)/videos-table-skeleton', () => ({
  VideosTableSkeleton: () => <div data-testid="videos-table-skeleton" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <VideosView />', () => {
  beforeEach(() => {
    shouldSuspend.value = false;
    tableProps = undefined;
  });

  const renderComponent = async (searchParams: SearchParams = {}) => {
    const ServerComponent = await VideosView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <VideosTable /> when not suspended', async () => {
    await renderComponent();

    const videosTable = screen.getByTestId('videos-table');

    expect(videosTable).toBeInTheDocument();
  });

  test('Should pass the query and current page to <VideosTable />', async () => {
    await renderComponent({ query: 'apertura', page: '2' });

    expect(tableProps).toEqual(expect.objectContaining({ query: 'apertura', currentPage: '2' }));
  });

  test('Should render the skeleton while <VideosTable /> is loading', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await VideosView({
      searchParams: Promise.resolve({}),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('videos-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
