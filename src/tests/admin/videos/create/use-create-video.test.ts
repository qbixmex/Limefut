import { renderHook, act } from '@testing-library/react';
import { useCreateVideo } from '@/app/admin/videos/crear/use-create-video';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (formData: FormData) => Promise<{
      ok: boolean;
      message: string;
      video: { id: string } | null;
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

vi.mock('@/app/admin/videos/(actions)', () => ({
  createVideoAction: mockCreateAction,
}));

const publishedDate = new Date('2026-02-01T10:00:00.000Z');

const validData = {
  title: 'Nuevo Video',
  permalink: 'nuevo-video',
  url: 'https://www.youtube.com/watch?v=abcdefghijk',
  platform: 'youtube',
  publishedDate,
  description: 'Descripción del nuevo video',
  active: true,
};

describe('Tests on useCreateVideo hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Video creado satisfactoriamente',
      video: { id: '1f0e2d3c-4b5a-4968-8776-655443322110' },
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateVideo());

    const values = result.current.form.getValues();

    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.url).toBe('');
    expect(values.platform).toBeUndefined();
    expect(values.publishedDate).toBeUndefined();
    expect(values.description).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should call createVideoAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreateVideo());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Nuevo Video');
    expect(formData.get('permalink')).toBe('nuevo-video');
    expect(formData.get('url')).toBe('https://www.youtube.com/watch?v=abcdefghijk');
    expect(formData.get('platform')).toBe('youtube');
    expect(formData.get('publishedDate')).toBe(publishedDate.toString());
    expect(formData.get('description')).toBe('Descripción del nuevo video');
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should stringify active as false when it is not enabled', async () => {
    const { result } = renderHook(() => useCreateVideo());

    await act(async () => {
      await result.current.onSubmit({ ...validData, active: false });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('active')).toBe('false');
  });

  test('onSubmit should show success toast, reset and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateVideo());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Video creado satisfactoriamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_VIDEOS);

    const values = result.current.form.getValues();
    expect(values.title).toBe('');
    expect(values.permalink).toBe('');
    expect(values.url).toBe('');
    expect(values.platform).toBeUndefined();
    expect(values.publishedDate).toBeUndefined();
    expect(values.description).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    const errorMessage = 'Error al crear el video';
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: errorMessage,
      video: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateVideo());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
