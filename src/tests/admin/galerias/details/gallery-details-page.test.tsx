import { render, screen } from '@testing-library/react';
import GalleryDetailsPage from '@/app/admin/galerias/[id]/page';

vi.mock('@/app/admin/galerias/[id]/gallery-details-view', () => ({
  GalleryDetailsView: () => <div data-testid="gallery-details-view" />,
}));

describe('Test on <GalleryDetailsPage />', () => {
  test('Should render <GalleryDetailsView /> component', () => {
    render(
      <GalleryDetailsPage
        params={Promise.resolve({ id: 'gallery-id' })}
      />,
    );

    const galleryDetailsView = screen.getByTestId('gallery-details-view');

    expect(galleryDetailsView).toBeInTheDocument();
  });
});
