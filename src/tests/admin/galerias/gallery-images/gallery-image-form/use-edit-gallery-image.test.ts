import { renderHook, act } from '@testing-library/react';
import { useEditGalleryImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-edit-gallery-image';

const { mockUpdateAction, mockOnSuccess } = vi.hoisted(() => ({
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      galleryImageId: string;
    }) => Promise<{
      ok: boolean;
      message: string;
      galleryImage: null;
    }>
  >(),
  mockOnSuccess: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/galerias/(actions)', () => ({
  updateGalleryImageAction: (params: {
    formData: FormData;
    galleryImageId: string;
  }) => mockUpdateAction(params),
}));

const galleryImage = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Imagen original',
  active: true,
  position: 2,
};

const defaultProps = {
  galleryImage,
  onSuccess: mockOnSuccess,
};

const validData = {
  title: 'Imagen editada',
  image: new File(['image-content'], 'editada.png', { type: 'image/png' }),
  position: 5,
  active: true,
};

describe('Tests on useEditGalleryImage hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'La imagen de la galería fue actualizada correctamente',
      galleryImage: null,
    });
  });

  test('Should initialize the form with the gallery image values', () => {
    const { result } = renderHook(() => useEditGalleryImage(defaultProps));

    const values = result.current.form.getValues();

    expect(values.title).toBe(galleryImage.title);
    expect(values.active).toBe(galleryImage.active);
    expect(values.position).toBe(galleryImage.position);
  });

  test('onSubmit should call updateGalleryImageAction with the form data and image id', async () => {
    const { result } = renderHook(() => useEditGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      formData: expect.any(FormData),
      galleryImageId: galleryImage.id,
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Imagen editada');
    expect(formData.get('position')).toBe('5');
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should not append active when it is false', async () => {
    const { result } = renderHook(() => useEditGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit({ ...validData, active: false });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('active')).toBeNull();
  });

  test('onSubmit should show a success toast and call onSuccess', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'La imagen de la galería fue actualizada correctamente',
    );
    expect(result.current.form.getValues().title).toBe(galleryImage.title);
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('onSubmit should show an error toast and not call onSuccess on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar la imagen',
      galleryImage: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar la imagen');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
