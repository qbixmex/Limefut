import { renderHook, act } from '@testing-library/react';
import { useCreateGallery } from '@/app/admin/galerias/crear/use-create-gallery';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (formData: FormData) => Promise<{
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
  createGalleryAction: mockCreateAction,
}));

const galleryDate = new Date('2026-02-01T10:00:00.000Z');

const validData = {
  title: '  Nueva Galería  ',
  permalink: '  nueva-galeria  ',
  galleryDate,
  active: true,
};

describe('Tests on useCreateGallery hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Galería creada satisfactoriamente',
      gallery: { id: '1f0e2d3c-4b5a-4968-8776-655443322110' },
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateGallery());

    const values = result.current.form.getValues();

    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.galleryDate).toBeInstanceOf(Date);
    expect(values.active).toBe(false);
  });

  test('onSubmit should call createGalleryAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreateGallery());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Nueva Galería');
    expect(formData.get('permalink')).toBe('nueva-galeria');
    expect(formData.get('galleryDate')).toBe(galleryDate.toISOString());
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should serialize a missing gallery date using the current date', async () => {
    const { result } = renderHook(() => useCreateGallery());

    await act(async () => {
      await result.current.onSubmit({
        ...validData,
        galleryDate: undefined as unknown as Date,
      });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(new Date(formData.get('galleryDate') as string).getTime()).not.toBeNaN();
  });

  test('onSubmit should show success toast, reset and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateGallery());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Galería creada satisfactoriamente');
    expect(mockReplace).toHaveBeenCalledWith(
      ROUTES.ADMIN_GALLERIES_SHOW('1f0e2d3c-4b5a-4968-8776-655443322110'),
    );

    const values = result.current.form.getValues();
    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.active).toBe(false);
  });

  test('handleNavigateBack should reset the form and navigate', () => {
    const { result } = renderHook(() => useCreateGallery());

    act(() => {
      result.current.form.setValue('title', 'Nueva Galería');
    });
    act(() => {
      result.current.handleNavigateBack();
    });

    expect(result.current.form.getValues().title).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_GALLERIES);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear la galería',
      gallery: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateGallery());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear la galería');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
