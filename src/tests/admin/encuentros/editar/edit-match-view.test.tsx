import { render, screen } from '@testing-library/react';
import { EditMatchView } from '@/app/admin/encuentros/editar/[id]/edit-match-view';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';
import { matchForEditMock, MATCH_ID } from '../mocks/match-for-edit.mock';
import { tournamentsMock } from '../mocks/tournaments.mock';
import { categoriesMock } from '../mocks/categories.mock';
import { fieldsMock } from '../mocks/fields.mock';

const mockRedirect = vi.hoisted(() => vi.fn());
const formProps = vi.hoisted(() => ({ current: undefined as unknown }));
const penaltyProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-match.action', () => ({
  fetchMatchAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action', () => ({
  fetchTournamentsForMatchAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action', () => ({
  fetchTeamsForMatchEditAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-fields.action', () => ({
  fetchFieldsAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-categories-for-match.action', () => ({
  fetchCategoriesForMatchAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/editar/[id]/edit-match-form', () => ({
  EditMatchForm: (props: unknown) => {
    formProps.current = props;
    return <div data-testid="edit-match-form" />;
  },
}));

vi.mock('@/shared/components/penalty-shoots', () => ({
  PenaltyShoots: (props: unknown) => {
    penaltyProps.current = props;
    return <div data-testid="penalty-shoots" />;
  },
}));

import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchTeamsForMatchEditAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import { fetchFieldsAction } from '@/app/admin/encuentros/(actions)/fetch-fields.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';

const defaultResponse = {
  ok: true,
  message: 'Encuentro obtenido correctamente',
  match: matchForEditMock,
};

describe('Tests on <EditMatchContent />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formProps.current = undefined;
    penaltyProps.current = undefined;

    vi.mocked(fetchMatchAction).mockResolvedValue(defaultResponse as never);
    vi.mocked(fetchTournamentsForMatchAction).mockResolvedValue({
      ok: true,
      message: 'Los torneos fueron obtenidos correctamente',
      tournaments: tournamentsMock,
    });
    vi.mocked(fetchCategoriesForMatchAction).mockResolvedValue({
      ok: true,
      message: 'Las categorías fueron obtenidas correctamente',
      categories: categoriesMock,
    });
    vi.mocked(fetchTeamsForMatchEditAction).mockResolvedValue({
      ok: true,
      message: 'Los equipos fueron obtenidos correctamente',
      teams: [],
    });
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ok: true,
      message: 'Las canchas fueron obtenidas correctamente',
      fields: fieldsMock,
    });
  });

  const renderComponent = async (response = defaultResponse) => {
    vi.mocked(fetchMatchAction).mockResolvedValue(response as never);
    const ServerComponent = await EditMatchView({
      params: Promise.resolve({ id: MATCH_ID }),
      searchParams: Promise.resolve({}),
    });
    return render(ServerComponent);
  };

  test('Should call fetchMatchAction with the match id', async () => {
    await renderComponent();

    expect(fetchMatchAction).toHaveBeenCalledWith(MATCH_ID);
  });

  test('Should render <EditMatchForm /> with the match', async () => {
    await renderComponent();

    expect(screen.getByTestId('edit-match-form')).toBeInTheDocument();
    expect(formProps.current).toEqual(
      expect.objectContaining({ match: matchForEditMock }),
    );
  });

  test('Should render the penalty shoots section when a completed match ends in a draw', async () => {
    await renderComponent({
      ...defaultResponse,
      match: {
        ...matchForEditMock,
        status: MATCH_STATUS.COMPLETED,
        localScore: 1,
        visitorScore: 1,
      },
    });

    expect(screen.getByTestId('penalty-shoots')).toBeInTheDocument();
  });

  test('Should not render the penalty shoots section when there is a winner', async () => {
    await renderComponent({
      ...defaultResponse,
      match: {
        ...matchForEditMock,
        status: MATCH_STATUS.COMPLETED,
        localScore: 3,
        visitorScore: 1,
      },
    });

    expect(screen.queryByTestId('penalty-shoots')).not.toBeInTheDocument();
  });

  test('Should not render the penalty shoots section when the match is not completed', async () => {
    await renderComponent();

    expect(screen.queryByTestId('penalty-shoots')).not.toBeInTheDocument();
  });

  test('Should redirect when the match fetch fails', async () => {
    vi.mocked(fetchMatchAction).mockResolvedValue({
      ok: false,
      message: 'Encuentro no encontrado',
      match: null,
    });

    await expect(async () => {
      await EditMatchView({
        params: Promise.resolve({ id: MATCH_ID }),
        searchParams: Promise.resolve({}),
      });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent('Encuentro no encontrado'),
    );
  });
});
