import { render, screen } from '@testing-library/react';
import CreateMatchPage from '@/app/admin/encuentros/crear/page';

vi.mock('@/app/admin/encuentros/crear/create-match-view', () => ({
  MatchView: () => <div data-testid="create-match-view" />,
}));

describe('Test on <CreateMatchPage />', () => {
  const renderPage = (searchParams: Record<string, string> = {}) => {
    return render(
      <CreateMatchPage searchParams={Promise.resolve(searchParams)} />,
    );
  };

  test('Should render the title', () => {
    renderPage();

    const createButton = screen.getByText(/crear encuentro/i);

    expect(createButton).toBeInTheDocument();
  });

  test('Should render <MatchView />', () => {
    renderPage();

    const createMatchView = screen.getByTestId('create-match-view');

    expect(createMatchView).toBeInTheDocument();
  });
});
