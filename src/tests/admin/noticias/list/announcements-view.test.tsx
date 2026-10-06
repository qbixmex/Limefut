import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { AnnouncementsView } from '@/app/admin/noticias/(components)/announcements-view';

const shouldSuspend = vi.hoisted(() => ({ value: false }));

let tableProps: Record<string, unknown> | undefined;

vi.mock('@/app/admin/noticias/(components)/announcements-table', () => ({
  AnnouncementsTable: (props: Record<string, unknown>) => {
    tableProps = props;

    if (shouldSuspend.value) {
      use(new Promise(() => {}));
    }

    return <div data-testid="announcements-table" />;
  },
}));

vi.mock('@/app/admin/noticias/(components)/announcements-table-skeleton', () => ({
  AnnouncementsTableSkeleton: () => <div data-testid="announcements-table-skeleton" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <AnnouncementsView />', () => {
  beforeEach(() => {
    shouldSuspend.value = false;
    tableProps = undefined;
  });

  const renderComponent = async (searchParams: SearchParams = {}) => {
    const ServerComponent = await AnnouncementsView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <AnnouncementsTable /> when not suspended', async () => {
    await renderComponent();

    const announcementsTable = screen.getByTestId('announcements-table');

    expect(announcementsTable).toBeInTheDocument();
  });

  test('Should pass the query and current page to <AnnouncementsTable />', async () => {
    await renderComponent({ query: 'apertura', page: '2' });

    expect(tableProps).toEqual(expect.objectContaining({ query: 'apertura', currentPage: '2' }));
  });

  test('Should render the skeleton while <AnnouncementsTable /> is loading', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await AnnouncementsView({
      searchParams: Promise.resolve({}),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('announcements-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
