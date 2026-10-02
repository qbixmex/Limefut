const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/(actions)/fetch-tournaments.action', () => ({
  fetchTournamentsAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/(components)/form-fields/tournament-select-field/tournament-form-select', () => ({
  TournamentFormSelect: ({ tournaments }: { tournaments: unknown[] }) => (
    <div data-testid="tournament-form-select">{tournaments.length}</div>
  ),
}));

import { TournamentSelectField } from '@/app/admin/liguilla/(components)/form-fields/tournament-select-field';
import { render, screen } from '@testing-library/react';
import { fetchTournamentsAction } from '@/app/admin/liguilla/(actions)/fetch-tournaments.action';
import { tournamentsMock } from '../mocks/tournaments.mock';
import { ROUTES } from '@/shared/constants/routes';

describe('Test on <TournamentSelectField />', () => {
  test('Should render <TournamentFormSelect /> with the tournaments', async () => {
    vi.mocked(fetchTournamentsAction).mockResolvedValue({
      ok: true,
      message: 'Los torneos fueron obtenidos correctamente',
      tournaments: tournamentsMock,
    });

    const ServerComponent = await TournamentSelectField({});
    render(ServerComponent);

    const formSelect = screen.getByTestId('tournament-form-select');

    expect(formSelect).toHaveTextContent(String(tournamentsMock.length));
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchTournamentsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los torneos',
      tournaments: [],
    });

    await expect(TournamentSelectField({})).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent('Error al obtener los torneos')}`,
    );
  });
});
