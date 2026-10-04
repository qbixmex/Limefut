import { render, screen } from '@testing-library/react';
import CreateGalleryPage from '@/app/admin/galerias/crear/page';

vi.mock('@/app/admin/galerias/crear/create-gallery-form', () => ({
  CreateGalleryForm: () => <div data-testid="create-gallery-form" />,
}));

describe('Test on <CreateGalleryPage />', () => {
  test('Should render the page title', () => {
    render(<CreateGalleryPage />);

    const title = screen.getByText(/crear galería/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreateGalleryForm /> component', () => {
    render(<CreateGalleryPage />);

    const form = screen.getByTestId('create-gallery-form');

    expect(form).toBeInTheDocument();
  });
});
