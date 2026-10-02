import { render, screen } from '@testing-library/react';
import { PlayoffsTable } from '@/app/admin/liguilla/playoffs-table';
import { playoffsMock } from '../mocks/playoffs.mock';
import { ROUTES } from '@/shared/constants/routes';

vi.mock('@/app/admin/liguilla/(components)/show-details', () => ({
  ShowDetails: () => <span data-testid="show-details" />,
}));

vi.mock('@/app/admin/liguilla/(components)/show-playoff-matches', () => ({
  ShowPlayoffMatches: () => <span data-testid="show-playoff-matches" />,
}));

vi.mock('@/app/admin/liguilla/(components)/delete-playoff', () => ({
  DeletePlayoff: () => <span data-testid="delete-playoff" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on <PlayoffsTable /> component', () => {
  const defaultProps = {
    playoffs: playoffsMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = (props = defaultProps) => {
    return render(<PlayoffsTable {...props} />);
  };

  test('Should render the table', () => {
    renderComponent();

    const table = screen.getByRole('table', { name: /lista/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render tournament name and link', () => {
    renderComponent();

    playoffsMock.forEach((playoff) => {
      const link = screen.getByRole('link', { name: playoff.tournament.name });

      expect(link).toHaveAttribute(
        'href',
        ROUTES.ADMIN_TOURNAMENTS_SHOW(playoff.tournament.id),
      );
    });
  });

  test('Should render category badge', () => {
    renderComponent();

    const categoryBadge = screen.getByText(playoffsMock[0].category!.name);

    expect(categoryBadge).toBeInTheDocument();
  });

  test('Should render fallback badge when category is not available', () => {
    renderComponent();

    const fallbackBadge = screen.getByText(/no disponible/i);

    expect(fallbackBadge).toBeInTheDocument();
  });

  test('Should render teams count', () => {
    renderComponent();

    playoffsMock.forEach((playoff) => {
      const teamsCount = screen.getByText(playoff.teamsCount.toString());

      expect(teamsCount).toBeInTheDocument();
    });
  });

  test('Should render action buttons per row', () => {
    renderComponent();

    const showDetails = screen.getAllByTestId('show-details');
    const showMatches = screen.getAllByTestId('show-playoff-matches');
    const deletePlayoff = screen.getAllByTestId('delete-playoff');

    expect(showDetails).toHaveLength(playoffsMock.length);
    expect(showMatches).toHaveLength(playoffsMock.length);
    expect(deletePlayoff).toHaveLength(playoffsMock.length);
  });

  test('Should render empty state when no playoffs', () => {
    renderComponent({ ...defaultProps, playoffs: [] });

    const emptyMessage = screen.getByText(/no hay liguillas disponibles/i);
    const showDetails = screen.queryAllByTestId('show-details');

    expect(emptyMessage).toBeInTheDocument();
    expect(showDetails).toHaveLength(0);
  });

  test('Should hide pagination when totalPages is 1', () => {
    renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).toHaveClass('hidden');
  });

  test('Should render pagination when totalPages is greater than 1', () => {
    renderComponent({
      ...defaultProps,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).not.toHaveClass('hidden');
  });
});
