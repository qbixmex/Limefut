import { render, screen } from '@testing-library/react';
import CreatePlayoffPage from '@/app/admin/liguilla/crear/page';

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/liguilla/crear/create-playoff-view', () => ({
  CreatePlayoffView: () => <div data-testid="create-playoff-view" />,
}));

describe('Test on <CreatePlayoffPage />', () => {
  const renderPage = async () => {
    const ServerComponent = await CreatePlayoffPage({
      searchParams: Promise.resolve({}),
    });
    return render(ServerComponent);
  };

  test('Should render title', async () => {
    await renderPage();

    const title = screen.getByText(/crear liguilla/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreatePlayoffView /> component', async () => {
    await renderPage();

    const createPlayoffView = screen.getByTestId('create-playoff-view');

    expect(createPlayoffView).toBeInTheDocument();
  });
});
