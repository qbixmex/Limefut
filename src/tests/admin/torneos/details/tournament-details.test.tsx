import TournamentPage from '@/app/admin/torneos/[id]/page';
import { render, screen } from '@testing-library/react';

const { mockedEditTournament, mockedEditTournamentWrapper } = vi.hoisted(() => ({
  mockedEditTournament: vi.fn(),
  mockedEditTournamentWrapper: vi.fn(),
}));

vi.mock('@/app/admin/torneos/(components)/edit-tournament', () => ({
  EditTournament: (...args: unknown[]) => mockedEditTournament(...args),
}));

vi.mock('@/app/admin/torneos/(components)/edit-tournament-wrapper', () => ({
  EditTournamentWrapper: (...args: unknown[]) => mockedEditTournamentWrapper(...args),
}));

vi.mock('@/app/admin/torneos/[id]/tournament-view.tsx', () => ({
  TournamentView: () => <span>Tournament Details</span>,
}));

describe('Test on <TournamentPage />', () => {
  const tournamentId = 'aa6ee3ae-2149-4320-b333-6d0bc93527ea';

  beforeEach(() => {
    mockedEditTournament.mockImplementation(() => <span>Edit Tournament</span>);
  });

  test('Should render correctly', async () => {
    const ServerComponent = await TournamentPage({
      params: Promise.resolve({ id: tournamentId }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });
    expect(cardHeading).toHaveTextContent(/información del torneo/i);
  });

  test('Should pass the resolved tournament id to EditTournament', async () => {
    const ServerComponent = await mockedEditTournamentWrapper({
      params: Promise.resolve({ id: tournamentId }),
    });
    render(ServerComponent);

    expect(mockedEditTournamentWrapper.mock.calls[0][0]).toEqual(
      expect.objectContaining({ params: Promise.resolve({ id: tournamentId }) }),
    );
  });
});
