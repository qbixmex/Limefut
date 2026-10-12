import { render, screen } from '@testing-library/react';
import EditMatchPage from '@/app/admin/encuentros/editar/[id]/page';

vi.mock('@/app/admin/encuentros/editar/[id]/edit-match-view', () => ({
  EditMatchView: () => <div data-testid="edit-match-view" />,
}));

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Test on <EditMatchPage />', () => {
  const renderPage = (searchParams: Record<string, string> = {}) => {
    return render(
      <EditMatchPage
        params={Promise.resolve({ id: matchId })}
        searchParams={Promise.resolve(searchParams)}
      />,
    );
  };

  test('Should render the title', () => {
    renderPage();

    expect(screen.getByText(/editar encuentro/i)).toBeInTheDocument();
  });

  test('Should render <EditMatchView />', () => {
    renderPage();

    const editMatchView = screen.getByTestId('edit-match-view');

    expect(editMatchView).toBeInTheDocument();
  });
});
