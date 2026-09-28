import CoachPage from '@/app/admin/entrenadores/perfil/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/entrenadores/perfil/[id]/coach-view', () => ({
  CoachView: () => <span>Coach Details</span>,
}));

describe('Test on <CoachPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CoachPage({
      params: Promise.resolve({
        id: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });

    expect(cardHeading).toHaveTextContent(/entrenador/i);
  });
});
