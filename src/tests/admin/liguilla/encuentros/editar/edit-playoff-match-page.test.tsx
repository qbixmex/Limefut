import { render, screen } from '@testing-library/react';
import EditPlayoffMatchPage from '@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/page';

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/edit-playoff-match-view', () => ({
  EditPlayoffMatchView: () => <div data-testid="edit-playoff-match-view" />,
}));

const params = Promise.resolve({
  playoff_id: '376ec9ed-fd25-4d92-ad26-35b7a354eab1',
  match_id: '24620ff5-cd48-4385-9ab8-b6320d69947f',
});

describe('Test on <EditPlayoffMatchPage />', () => {
  const renderPage = () => render(<EditPlayoffMatchPage params={params} />);

  test('Should render the title', () => {
    renderPage();

    const title = screen.getByText(/editar encuentro/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <EditPlayoffMatchView />', () => {
    renderPage();

    const editPlayoffMatchView = screen.getByTestId('edit-playoff-match-view');

    expect(editPlayoffMatchView).toBeInTheDocument();
  });
});
