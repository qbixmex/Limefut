import { renderHook, act } from '@testing-library/react';
import { useCreateGalleryImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-create-gallery-image';

const { mockCreateAction, mockOnSuccess } = vi.hoisted(() => ({
  mockCreateAction: vi.fn<
    (params: {
      galleryId: string;
      formData: FormData;
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
  createGalleryImageAction: (params: { galleryId: string; formData: FormData }) =>
    mockCreateAction(params),
}));

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const imagesQuantity = 4;

const defaultProps = {
  galleryId,
  imagesQuantity,
  onSuccess: mockOnSuccess,
};

const imageFile = new File(['image-content'], 'imagen.png', {
  type: 'image/png',
});

const validData = {
  title: 'Imagen de prueba',
  image: imageFile,
  position: 3,
  active: true,
};

describe('Tests on useCreateGalleryImage hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'La imagen se cargó correctamente',
      galleryImage: null,
    });
  });

  test('Should initialize the form with the default values', () => {
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    const values = result.current.form.getValues();

    expect(values.title).toBe('');
    expect(values.active).toBe(false);
    expect(values.position).toBe(imagesQuantity + 1);
  });

  test('onSubmit should call createGalleryImageAction with the gallery id and FormData', async () => {
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith({
      galleryId,
      formData: expect.any(FormData),
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Imagen de prueba');
    expect(formData.get('image')).toBe(imageFile);
    expect(formData.get('position')).toBe('3');
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should not append active when it is false', async () => {
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit({ ...validData, active: false });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('active')).toBeNull();
  });

  test('onSubmit should not append the image when it is missing', async () => {
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit({
        ...validData,
        image: undefined as unknown as File,
      });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show a success toast, reset the form and call onSuccess', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'La imagen se cargó correctamente',
    );
    expect(result.current.form.getValues().title).toBe('');
    expect(result.current.form.getValues().position).toBe(imagesQuantity + 1);
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('onSubmit should show an error toast and not call onSuccess on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al subir la imagen',
      galleryImage: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateGalleryImage(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al subir la imagen');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
