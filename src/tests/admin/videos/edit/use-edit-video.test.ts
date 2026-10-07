import { renderHook, act } from '@testing-library/react';
import { useEditVideo } from '@/app/admin/videos/editar/[id]/use-edit-video';
import { ROUTES } from '@/shared/constants/routes';
import { videoMock } from '../mocks/video.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      videoId: string;
    }) => Promise<{
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
  updateVideoAction: mockUpdateAction,
}));

const videoId = videoMock.id;
const publishedDate = videoMock.publishedDate;

const validData = {
  title: 'Video Editado',
  permalink: 'video-editado',
  url: 'https://www.youtube.com/watch?v=zyxwvutsrqp',
  platform: 'vimeo',
  publishedDate,
  description: 'Descripción editada',
  active: false,
};

describe('Tests on useEditVideo hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El video fue actualizado correctamente',
      video: { id: videoId },
    });
  });

  test('Should initialize form with the video default values', () => {
    const { result } = renderHook(() => useEditVideo(videoMock));

    const values = result.current.form.getValues();

    expect(values.title).toBe(videoMock.title);
    expect(values.permalink).toBe(videoMock.permalink);
    expect(values.url).toBe(videoMock.url);
    expect(values.platform).toBe(videoMock.platform);
    expect(values.publishedDate).toEqual(videoMock.publishedDate);
    expect(values.description).toBe(videoMock.description);
    expect(values.active).toBe(videoMock.active);
  });

  test('onSubmit should call updateVideoAction with the correct params', async () => {
    const { result } = renderHook(() => useEditVideo(videoMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      formData: expect.any(FormData),
      videoId,
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Video Editado');
    expect(formData.get('permalink')).toBe('video-editado');
    expect(formData.get('url')).toBe('https://www.youtube.com/watch?v=zyxwvutsrqp');
    expect(formData.get('platform')).toBe('vimeo');
    expect(formData.get('publishedDate')).toBe(publishedDate.toString());
    expect(formData.get('description')).toBe('Descripción editada');
    expect(formData.get('active')).toBe('false');
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditVideo(videoMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('El video fue actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_VIDEOS);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el video',
      video: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditVideo(videoMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el video');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
