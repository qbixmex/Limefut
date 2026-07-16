import EditTournamentPage from '@/app/admin/torneos/editar/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/torneos/editar/[id]/edit-tournament-view', () => ({
  EditTournamentView: () => null,
}));

describe('Test on <EditTournamentPage />', () => {
  test('Should render correctly', async () => {
    const params = Promise.resolve({ id: 'abc-123' });
    const ServerComponent = await EditTournamentPage({ params });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/editar/i);
  });
});
