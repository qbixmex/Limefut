import { renderHook, act } from '@testing-library/react';
import { useEditGallery } from '@/app/admin/galerias/editar/[id]/use-edit-gallery';
import { ROUTES } from '@/shared/constants/routes';
import type { Gallery } from '@/shared/interfaces';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      galleryId: string;
    }) => Promise<{
      ok: boolean;
      message: string;
      gallery: { id: string } | null;
    }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/galerias/(actions)', () => ({
  updateGalleryAction: mockUpdateAction,
}));

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const galleryDate = new Date('2026-01-15T12:00:00.000Z');

const gallery: Gallery = {
  id: galleryId,
  title: 'Galería de Apertura',
  permalink: 'galeria-de-apertura',
  galleryDate,
  active: true,
};

const defaultProps = { gallery };

const validData = {
  title: '  Galería Editada  ',
  permalink: '  galeria-editada  ',
  galleryDate,
  active: false,
};

describe('Tests on useEditGallery hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'La galería fue actualizada correctamente',
      gallery: { id: galleryId },
    });
  });

  test('Should initialize form with the gallery default values', () => {
    const { result } = renderHook(() => useEditGallery(defaultProps));

    const values = result.current.form.getValues();

    expect(values.title).toBe(gallery.title);
    expect(values.permalink).toBe(gallery.permalink);
    expect(values.galleryDate).toEqual(gallery.galleryDate);
    expect(values.active).toBe(gallery.active);
  });

  test('handleNavigateBack should navigate to the galleries list', () => {
    const { result } = renderHook(() => useEditGallery(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_GALLERIES);
  });

  test('onSubmit should call updateGalleryAction with the correct params', async () => {
    const { result } = renderHook(() => useEditGallery(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      formData: expect.any(FormData),
      galleryId,
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Galería Editada');
    expect(formData.get('permalink')).toBe('galeria-editada');
    expect(formData.get('galleryDate')).toBe(galleryDate.toISOString());
    expect(formData.get('active')).toBe('false');
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditGallery(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('La galería fue actualizada correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_GALLERIES_SHOW(galleryId));
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: '¡ Error al actualizar la galería !',
      gallery: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditGallery(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('¡ Error al actualizar la galería !');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
