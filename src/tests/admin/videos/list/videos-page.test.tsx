import { render, screen } from '@testing-library/react';
import VideosPage from '@/app/admin/videos/page';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/videos/(components)/create-video', () => ({
  CreateVideo: () => <div data-testid="create-video" />,
}));

vi.mock('@/app/admin/videos/(components)/videos-view', () => ({
  VideosView: () => <div data-testid="videos-view" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <VideosPage />', () => {
  const renderPage = (searchParams: SearchParams = {}) => {
    render(
      <VideosPage
        searchParams={Promise.resolve(searchParams)}
      />,
    );
  };

  test('Should render the page title', () => {
    renderPage();

    const title = screen.getByText(/^videos$/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <Search /> component', () => {
    renderPage();

    const search = screen.getByTestId('search-component');

    expect(search).toBeInTheDocument();
  });

  test('Should render <CreateVideo /> component', () => {
    renderPage();

    const createVideo = screen.getByTestId('create-video');

    expect(createVideo).toBeInTheDocument();
  });

  test('Should render <VideosView /> component', () => {
    renderPage();

    const videosView = screen.getByTestId('videos-view');

    expect(videosView).toBeInTheDocument();
  });
});
