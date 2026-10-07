const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

const mockFetchVideo = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/videos/(actions)', () => ({
  fetchVideoAction: mockFetchVideo,
}));

vi.mock('@/app/admin/videos/editar/[id]/edit-video-form', () => ({
  EditVideoForm: () => <span data-testid="edit-video-form" />,
}));

import { render, screen } from '@testing-library/react';
import { EditVideoView } from '@/app/admin/videos/editar/[id]/edit-video-view';
import { ROUTES } from '@/shared/constants/routes';
import { videoMock } from '../mocks/video.mock';

describe('Tests on <EditVideoView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchVideo.mockResolvedValue({
      ok: true,
      message: 'Video obtenido correctamente',
      video: videoMock,
    });
  });

  test('Should render <EditVideoForm /> when fetch succeeds', async () => {
    const serverComponent = await EditVideoView({
      params: Promise.resolve({ id: videoMock.id }),
    });
    render(serverComponent);

    const form = screen.getByTestId('edit-video-form');

    expect(form).toBeInTheDocument();
  });

  test('Should fetch the video with the given id', async () => {
    const serverComponent = await EditVideoView({
      params: Promise.resolve({ id: videoMock.id }),
    });
    render(serverComponent);

    expect(mockFetchVideo).toHaveBeenCalledWith(videoMock.id);
  });

  test('Should redirect when fetch fails', async () => {
    const testId = 'b94200ba-1421-4347-a8b2-fbfb8da6dd2c';
    mockFetchVideo.mockResolvedValue({
      ok: false,
      message: 'Video no encontrado',
      video: null,
    });

    await expect(
      EditVideoView({ params: Promise.resolve({ id: testId }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    const message = `El video con el id: [${testId}] no existe`;

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_VIDEOS}?error=${encodeURIComponent(message)}`,
    );
  });
});
