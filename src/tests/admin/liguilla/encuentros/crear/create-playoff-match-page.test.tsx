import { render, screen } from '@testing-library/react';
import CreatePlayoffMatchPage from '@/app/admin/liguilla/[playoff_id]/encuentros/crear/page';

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/crear/create-playoff-match-view', () => ({
  CreatePlayoffMatchView: () => <div data-testid="create-playoff-match-view" />,
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Test on <CreatePlayoffMatchPage />', () => {
  const renderPage = () => {
    return render(
      <CreatePlayoffMatchPage
        params={
          Promise.resolve({ playoff_id: playoffId })
        }
      />,
    );
  };

  test('Should render the title', () => {
    renderPage();

    const title = screen.getByText(/crear encuentro/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreatePlayoffMatchView />', () => {
    renderPage();

    const matchView = screen.getByTestId('create-playoff-match-view');

    expect(matchView).toBeInTheDocument();
  });
});
