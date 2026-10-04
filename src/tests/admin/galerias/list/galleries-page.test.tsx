import { render, screen } from '@testing-library/react';
import GalleriesPage from '@/app/admin/galerias/page';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/galerias/(components)/create-gallery', () => ({
  CreateGallery: () => <div data-testid="create-gallery" />,
}));

vi.mock('@/app/admin/galerias/(components)/galleries-view', () => ({
  GalleriesView: () => <div data-testid="galleries-view" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on <GalleriesPage />', () => {
  const renderPage = (searchParams: SearchParams = {}) => {
    render(
      <GalleriesPage
        searchParams={Promise.resolve(searchParams)}
      />,
    );
  };

  test('Should render the page title', () => {
    renderPage();

    const title = screen.getByText(/galerías/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <Search /> component', () => {
    renderPage();

    const search = screen.getByTestId('search-component');

    expect(search).toBeInTheDocument();
  });

  test('Should render <CreateGallery /> component', () => {
    renderPage();

    const createGallery = screen.getByTestId('create-gallery');

    expect(createGallery).toBeInTheDocument();
  });

  test('Should render <GalleriesView /> component', () => {
    renderPage();

    const galleriesView = screen.getByTestId('galleries-view');

    expect(galleriesView).toBeInTheDocument();
  });
});
