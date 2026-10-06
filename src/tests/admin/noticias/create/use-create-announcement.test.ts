import { renderHook, act } from '@testing-library/react';
import { useCreateAnnouncement } from '@/app/admin/noticias/crear/use-create-announcement';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: { formData: FormData }) => Promise<{
      ok: boolean;
      message: string;
      announcement: { id: string } | null;
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

vi.mock('@/app/admin/noticias/(actions)', () => ({
  createAnnouncementAction: mockCreateAction,
}));

const publishedDate = new Date('2026-02-01T10:00:00.000Z');

const validData = {
  title: 'Nueva Noticia',
  permalink: 'nueva-noticia',
  publishedDate,
  description: 'Descripción de la nueva noticia',
  content: 'Contenido de la nueva noticia',
  active: true,
};

describe('Tests on useCreateAnnouncement hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Noticia creada satisfactoriamente',
      announcement: { id: '1f0e2d3c-4b5a-4968-8776-655443322110' },
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateAnnouncement());

    const values = result.current.form.getValues();

    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.publishedDate).toBeUndefined();
    expect(values.description).toBe('');
    expect(values.content).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should call createAnnouncementAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreateAnnouncement());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith({ formData: expect.any(FormData) });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Nueva Noticia');
    expect(formData.get('permalink')).toBe('nueva-noticia');
    expect(formData.get('publishedDate')).toBe(publishedDate.toString());
    expect(formData.get('description')).toBe('Descripción de la nueva noticia');
    expect(formData.get('content')).toBe('Contenido de la nueva noticia');
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should append the image when provided', async () => {
    const imageFile = new File(['content'], 'noticia.png', { type: 'image/png' });
    const { result } = renderHook(() => useCreateAnnouncement());

    await act(async () => {
      await result.current.onSubmit({ ...validData, image: imageFile });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(imageFile);
  });

  test('onSubmit should not append the image when it is missing', async () => {
    const { result } = renderHook(() => useCreateAnnouncement());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show success toast, reset and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateAnnouncement());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Noticia creada satisfactoriamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_ANNOUNCEMENTS);

    const values = result.current.form.getValues();
    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.active).toBe(false);
  });

  test('handleRedirectBack should reset the form and navigate', () => {
    const { result } = renderHook(() => useCreateAnnouncement());

    act(() => {
      result.current.form.setValue('title', 'Nueva Noticia');
    });
    act(() => {
      result.current.handleRedirectBack();
    });

    expect(result.current.form.getValues()).toEqual({
      title: '',
      permalink: '',
      publishedDate: undefined,
      description: '',
      content: '',
      active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_ANNOUNCEMENTS);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    const errorMessage = 'Error al crear la noticia';
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: errorMessage,
      announcement: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateAnnouncement());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
