import { render, screen } from '@testing-library/react';
import AnnouncementsPage from '@/app/admin/noticias/page';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/noticias/(components)/create-announcement', () => ({
  CreateAnnouncement: () => <div data-testid="create-announcement" />,
}));

vi.mock('@/app/admin/noticias/(components)/announcements-view', () => ({
  AnnouncementsView: () => <div data-testid="announcements-view" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <AnnouncementsPage />', () => {
  const renderPage = (searchParams: SearchParams = {}) => {
    render(
      <AnnouncementsPage
        searchParams={Promise.resolve(searchParams)}
      />,
    );
  };

  test('Should render the page title', () => {
    renderPage();

    const title = screen.getByRole('heading', { name: /noticias/i });

    expect(title).toBeInTheDocument();
  });

  test('Should render <Search /> component', () => {
    renderPage();

    const search = screen.getByTestId('search-component');

    expect(search).toBeInTheDocument();
  });

  test('Should render <CreateAnnouncement /> component', () => {
    renderPage();

    const createAnnouncement = screen.getByTestId('create-announcement');

    expect(createAnnouncement).toBeInTheDocument();
  });

  test('Should render <AnnouncementsView /> component', () => {
    renderPage();

    const announcementsView = screen.getByTestId('announcements-view');

    expect(announcementsView).toBeInTheDocument();
  });
});
