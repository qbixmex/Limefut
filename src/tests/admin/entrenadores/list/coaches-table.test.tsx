import { render, screen } from '@testing-library/react';
import { CoachesTable } from '@/app/admin/entrenadores/(components)/coaches-table';
import { coachesMock } from '../mocks/coaches.mock';
import { fetchCoachesAction } from '@/app/admin/entrenadores/(actions)';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/entrenadores/(actions)', () => ({
  fetchCoachesAction: vi.fn(),
  updateCoachStateAction: vi.fn(),
}));

vi.mock('@/app/admin/entrenadores/(components)/show-coach', () => ({
  ShowCoach: () => <span data-testid="show-coach" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/edit-coach', () => ({
  EditCoach: () => <span data-testid="edit-coach" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/delete-coach', () => ({
  DeleteCoach: () => <span data-testid="delete-coach" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on <CoachesTable /> component', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los entrenadores fueron obtenidos correctamente',
    coaches: coachesMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async () => {
    const ServerComponent = await CoachesTable({
      query: '',
      currentPage: 1,
    });
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.mocked(fetchCoachesAction).mockResolvedValue(defaultResponse);
  });

  test('Should render correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /lista/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when no coaches', async () => {
    vi.mocked(fetchCoachesAction).mockResolvedValue({
      ...defaultResponse,
      coaches: [],
    });

    await renderComponent();

    const emptyMessage = screen.getByText(/no hay entrenadores/i);
    const table = screen.queryByRole('table', { name: /lista/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render coach name', async () => {
    await renderComponent();

    coachesMock.forEach((coach) => {
      expect(screen.getByText(coach.name)).toBeInTheDocument();
    });
  });

  test('Should render coach email', async () => {
    await renderComponent();

    coachesMock.forEach((coach) => {
      expect(screen.getByText(coach.email as string)).toBeInTheDocument();
    });
  });

  test('Should render coach phone', async () => {
    await renderComponent();

    coachesMock.forEach((coach) => {
      expect(screen.getByText(coach.phone as string)).toBeInTheDocument();
    });
  });

  test('Should render teams count badge', async () => {
    await renderComponent();

    coachesMock.forEach((coach) => {
      expect(screen.getByText(coach.teamsCount.toString())).toBeInTheDocument();
    });
  });

  test('Should render show coach', async () => {
    await renderComponent();
    const showButtons = screen.getAllByTestId('show-coach');
    expect(showButtons).toHaveLength(coachesMock.length);
  });

  test('Should render edit coach', async () => {
    await renderComponent();
    const editButtons = screen.getAllByTestId('edit-coach');
    expect(editButtons).toHaveLength(coachesMock.length);
  });

  test('Should render delete coach', async () => {
    await renderComponent();
    const deleteButtons = screen.getAllByTestId('delete-coach');
    expect(deleteButtons).toHaveLength(coachesMock.length);
  });

  test('Should render active switch', async () => {
    await renderComponent();
    const switchButtons = screen.getAllByTestId('active-switch');
    expect(switchButtons).toHaveLength(coachesMock.length);
  });

  test('Should hide pagination when totalPages is 1', async () => {
    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).toHaveClass('hidden');
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    vi.mocked(fetchCoachesAction).mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).not.toHaveClass('hidden');
  });

  test('Should render empty state when fetch fails', async () => {
    vi.mocked(fetchCoachesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los entrenadores',
      coaches: null,
      pagination: null,
    });

    await renderComponent();

    const emptyMessage = screen.getByText('Aún no hay entrenadores');
    const table = screen.queryByRole('table', { name: /lista/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });
});
