const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/(actions)/fetch-playoff.action', () => ({
  fetchPlayoffAction: vi.fn(),
}));

import { render, screen } from '@testing-library/react';
import { fetchPlayoffAction } from '@/app/admin/liguilla/(actions)/fetch-playoff.action';
import { PlayOffDetailsView } from '@/app/admin/liguilla/[playoff_id]/playoff-details-view';
import { ROUTES } from '@/shared/constants/routes';
import { playoffId, playoffMock } from '../mocks/playoff.mock';

const defaultResponse = {
  ok: true,
  message: 'La liguilla fue obtenida correctamente',
  playoff: playoffMock,
};

describe('Tests on <PlayOffDetailsView />', () => {
  const renderComponent = async (response = defaultResponse) => {
    vi.mocked(fetchPlayoffAction).mockResolvedValue(response);
    const ServerComponent = await PlayOffDetailsView({
      params: Promise.resolve({ playoff_id: playoffId }),
    });
    return render(ServerComponent);
  };

  test('Should call fetchPlayoffAction with the playoff id', async () => {
    await renderComponent();

    expect(vi.mocked(fetchPlayoffAction)).toHaveBeenCalledWith(playoffId);
  });

  test('Should render the teams ordered with their position', async () => {
    await renderComponent();

    playoffMock.teams.forEach((team, index) => {
      const link = screen.getByRole('link', { name: `${index + 1}: ${team.name}` });

      expect(link).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(team.id));
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test('Should render the tournament link', async () => {
    await renderComponent();

    const link = screen.getByRole('link', { name: playoffMock.tournament.name });

    expect(link).toHaveAttribute(
      'href',
      ROUTES.ADMIN_TOURNAMENTS_SHOW(playoffMock.tournament.id),
    );
  });

  test('Should render the category badge', async () => {
    await renderComponent();

    const categoryName = screen.getByText(playoffMock.category!.name);

    expect(categoryName).toBeInTheDocument();
  });

  test('Should render the fallback category badge when there is no category', async () => {
    await renderComponent({
      ...defaultResponse,
      playoff: { ...playoffMock, category: undefined },
    });

    const emptyMessage = screen.getByText(/no definida/i);

    expect(emptyMessage).toBeInTheDocument();
  });

  test('Should render the starting round', async () => {
    await renderComponent();

    const startingRound = screen.getByText(playoffMock.startingRound);

    expect(startingRound).toBeInTheDocument();
  });

  test('Should render the empty teams message when there are no teams', async () => {
    await renderComponent({
      ...defaultResponse,
      playoff: { ...playoffMock, teams: [] },
    });

    const emptyTeamsMessage = screen.getByText(/no hay equipos disponibles/i);

    expect(emptyTeamsMessage).toBeInTheDocument();
  });

  test('Should redirect to the playoffs list when fetch fails', async () => {
    vi.mocked(fetchPlayoffAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener la liguilla',
      playoff: null,
    });

    await expect(async () => {
      await PlayOffDetailsView({
        params: Promise.resolve({ playoff_id: playoffId }),
      });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent('Error al obtener la liguilla')}`,
    );
  });
});
