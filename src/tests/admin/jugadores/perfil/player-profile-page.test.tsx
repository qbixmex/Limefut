import PlayerPage from '@/app/admin/jugadores/perfil/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/jugadores/perfil/[id]/player-view.tsx', () => ({
  PlayerView: () => <span>Player Details</span>,
}));

describe('Test on <PlayerPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await PlayerPage({
      params: Promise.resolve({
        id: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });

    expect(cardHeading).toHaveTextContent(/información/i);
  });
});
