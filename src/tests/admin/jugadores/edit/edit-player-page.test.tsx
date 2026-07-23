import { render, screen } from '@testing-library/react';
import EditPlayerPage from '@/app/admin/jugadores/editar/[id]/page';

vi.mock('@/app/admin/jugadores/editar/[id]/edit-player-view', () => ({
  EditPlayerView: () => <div data-testid="edit-player-view" />,
}));

describe('Test on <EditPlayerPage />', () => {
  test('Should render correctly', () => {
    render(
      <EditPlayerPage
        params={Promise.resolve({ id: 'test-id' })}
        searchParams={Promise.resolve({})}
      />,
    );

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/editar/i);
  });

  test('Should render <EditPlayerView /> component', () => {
    render(
      <EditPlayerPage
        params={Promise.resolve({ id: 'test-id' })}
        searchParams={Promise.resolve({})}
      />,
    );

    expect(screen.getByTestId('edit-player-view')).toBeInTheDocument();
  });
});
