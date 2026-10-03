import { render, screen } from '@testing-library/react';

const mockRedirect = vi.hoisted(() => vi.fn());
const formProps = vi.hoisted(() => ({ current: undefined as unknown }));
const penaltyProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-match-for-edit.action', () => ({
  fetchMatchForEditAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/edit-playoff-match-form', () => ({
  EditPlayoffsMatchForm: (props: unknown) => {
    formProps.current = props;
    return <div data-testid="edit-playoffs-match-form" />;
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/teams-slot', () => ({
  TeamsSlot: () => <span data-testid="teams-slot" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/fields-slot', () => ({
  FieldsSlot: () => <span data-testid="fields-slot" />,
}));

vi.mock('@/shared/components/penalty-shoots', () => ({
  PenaltyShoots: (props: unknown) => {
    penaltyProps.current = props;
    return <div data-testid="penalty-shoots" />;
  },
}));

import { fetchMatchForEditAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-match-for-edit.action';
import { EditPlayoffMatchView } from '@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/edit-playoff-match-view';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';
import {
  MATCH_ID,
  PLAYOFF_ID,
  playoffMatchForEditMock,
} from '../mocks/playoff-match-for-edit.mock';

const defaultResponse = {
  ok: true,
  message: 'Encuentro obtenido correctamente',
  match: playoffMatchForEditMock,
};

type ViewProps = {
  match: typeof playoffMatchForEditMock;
  availablePlayers: {
    localPlayers: { id: string; name: string }[];
    visitorPlayers: { id: string; name: string }[];
  };
};

describe('Tests on <EditPlayoffMatchView />', () => {
  beforeEach(() => {
    formProps.current = undefined;
    penaltyProps.current = undefined;
  });

  const renderComponent = async (response = defaultResponse) => {
    vi.mocked(fetchMatchForEditAction).mockResolvedValue(response as never);
    const ServerComponent = await EditPlayoffMatchView({
      params: Promise.resolve({ playoff_id: PLAYOFF_ID, match_id: MATCH_ID }),
    });
    return render(ServerComponent);
  };

  test('Should call fetchMatchForEditAction with the ids', async () => {
    await renderComponent();

    expect(vi.mocked(fetchMatchForEditAction)).toHaveBeenCalledWith({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });
  });

  test('Should render <EditPlayoffsMatchForm /> with the match', async () => {
    await renderComponent();

    const form = screen.getByTestId('edit-playoffs-match-form');

    expect(form).toBeInTheDocument();
    expect(formProps.current).toEqual(
      expect.objectContaining({
        playoffId: PLAYOFF_ID,
        match: playoffMatchForEditMock,
      }),
    );
  });

  test('Should render the penalty shoots section when a completed match ends in a draw', async () => {
    await renderComponent();

    const penaltyShoots = screen.getByTestId('penalty-shoots');

    expect(penaltyShoots).toBeInTheDocument();
  });

  test('Should pass the available players excluding the used shooters', async () => {
    await renderComponent();

    const props = penaltyProps.current as ViewProps;

    expect(props.availablePlayers.localPlayers).toEqual([
      {
        id: '8a25e828-6e50-42ff-8976-41d50acd058a',
        name: 'Juan Pérez',
      },
      {
        id: 'f7c23564-b820-4b44-85d4-8b58ec8dce10',
        name: 'Carlos Ochoa',
      },
    ]);
    expect(props.availablePlayers.visitorPlayers).toEqual([
      {
        id: '66997d26-ed01-47d4-b5eb-facbb4e55878',
        name: 'Alejandro Dominguez',
      },
    ]);
  });

  test('Should not render the penalty shoots section when there is a winner', async () => {
    await renderComponent({
      ...defaultResponse,
      match: { ...playoffMatchForEditMock, localScore: 3, visitorScore: 1 },
    });

    expect(screen.queryByTestId('penalty-shoots')).not.toBeInTheDocument();
  });

  test('Should not render the penalty shoots section when the match is not completed', async () => {
    await renderComponent({
      ...defaultResponse,
      match: {
        ...playoffMatchForEditMock,
        status: MATCH_STATUS.SCHEDULED,
        localScore: 2,
        visitorScore: 2,
      },
    });

    expect(screen.queryByTestId('penalty-shoots')).not.toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchMatchForEditAction).mockResolvedValue({
      ok: false,
      message: 'No se pudo obtener el encuentro',
      match: null,
    });

    await expect(async () => {
      await EditPlayoffMatchView({
        params: Promise.resolve({ playoff_id: PLAYOFF_ID, match_id: MATCH_ID }),
      });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS_MATCHES(PLAYOFF_ID)}?error=${encodeURIComponent(
        'No se pudo obtener el encuentro',
      )}`,
    );
  });
});
