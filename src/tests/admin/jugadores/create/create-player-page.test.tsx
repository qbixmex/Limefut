import { render, screen } from '@testing-library/react';
import CreatePlayerPage from '@/app/admin/jugadores/crear/page';

vi.mock('@/app/admin/jugadores/crear/create-player-view', () => ({
  CreatePlayerView: () => <div data-testid="create-player-view" />,
}));

describe('Test on <CreatePlayerPage />', () => {
  test('Should render correctly', () => {
    render(
      <CreatePlayerPage
        searchParams={Promise.resolve({})}
      />,
    );

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/crear/i);
  });

  test('Should render <CreatePlayerView /> component', () => {
    render(
      <CreatePlayerPage
        searchParams={Promise.resolve({})}
      />,
    );

    expect(screen.getByTestId('create-player-view')).toBeInTheDocument();
  });
});
