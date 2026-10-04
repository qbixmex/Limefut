import { render, screen } from '@testing-library/react';
import EditGalleryPage from '@/app/admin/galerias/editar/[id]/page';

vi.mock('@/app/admin/galerias/editar/[id]/edit-gallery-view', () => ({
  EditGalleryPageView: () => <div data-testid="edit-gallery-view" />,
}));

describe('Test on <EditGalleryPage />', () => {
  test('Should render <EditGalleryPageView /> component', () => {
    render(
      <EditGalleryPage
        params={Promise.resolve({ id: 'gallery-id' })}
      />,
    );

    const view = screen.getByTestId('edit-gallery-view');

    expect(view).toBeInTheDocument();
  });
});
