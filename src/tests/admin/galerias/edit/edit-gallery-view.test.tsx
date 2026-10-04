const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

const mockFetchGallery = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/galerias/(actions)', () => ({
  fetchGalleryAction: mockFetchGallery,
}));

vi.mock('@/app/admin/galerias/editar/[id]/edit-gallery-form', () => ({
  EditGalleryForm: () => <span data-testid="edit-gallery-form" />,
}));

import { render, screen } from '@testing-library/react';
import { EditGalleryPageView } from '@/app/admin/galerias/editar/[id]/edit-gallery-view';
import { ROUTES } from '@/shared/constants/routes';
import { galleryMock } from '../mocks/gallery.mock';

describe('Tests on <EditGalleryPageView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchGallery.mockResolvedValue({
      ok: true,
      message: '¡ Galería obtenida correctamente 👍 !',
      gallery: galleryMock,
    });
  });

  test('Should render <EditGalleryForm /> when fetch succeeds', async () => {
    const serverComponent = await EditGalleryPageView({
      params: Promise.resolve({ id: galleryMock.id as string }),
    });
    render(serverComponent);

    const title = screen.getByText(/editar galería/i);
    const form = screen.getByTestId('edit-gallery-form');

    expect(title).toBeInTheDocument();
    expect(form).toBeInTheDocument();
  });

  test('Should pass the fetched gallery to the form', async () => {
    const serverComponent = await EditGalleryPageView({
      params: Promise.resolve({ id: galleryMock.id as string }),
    });
    render(serverComponent);

    expect(mockFetchGallery).toHaveBeenCalledWith(galleryMock.id);
  });

  test('Should redirect when fetch fails', async () => {
    mockFetchGallery.mockResolvedValue({
      ok: false,
      message: 'Galería no encontrada',
      gallery: null,
    });

    await expect(
      EditGalleryPageView({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_GALLERIES}?error=${encodeURIComponent('Galería no encontrada')}`,
    );
  });

  test('Should redirect when fetch succeeds but returns no gallery', async () => {
    mockFetchGallery.mockResolvedValue({
      ok: true,
      message: 'Sin galería',
      gallery: null,
    });

    await expect(
      EditGalleryPageView({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalled();
  });
});
