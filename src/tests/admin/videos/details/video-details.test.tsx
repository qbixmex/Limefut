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

import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { VideoView } from '@/app/admin/videos/[id]/video-view';
import { ROUTES } from '@/shared/constants/routes';
import { videoMock, videoInactiveMock } from '../mocks/video.mock';

describe('Tests on <VideoView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchVideo.mockResolvedValue({
      ok: true,
      message: 'Video obtenido correctamente',
      video: videoMock,
    });
  });

  const renderComponent = async (videoId = videoMock.id) => {
    const element = await VideoView({
      params: Promise.resolve({ id: videoId }),
    });
    return render(element, { wrapper: TooltipProvider });
  };

  test('Should render the video information', async () => {
    await renderComponent();

    // NOTE: The <CardTitle /> in video-view.tsx lacks the role="heading" /
    // aria-level attributes that the noticias detail page uses.
    expect(screen.getByText(/detalles del video/i)).toBeInTheDocument();
    expect(mockFetchVideo).toHaveBeenCalledWith(videoMock.id);
  });

  test('Should render the title, permalink and description', async () => {
    await renderComponent();

    expect(screen.getByRole('cell', { name: videoMock.title })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: videoMock.permalink })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: videoMock.description })).toBeInTheDocument();
  });

  test('Should render the publication date', async () => {
    await renderComponent();

    const formattedDate = videoMock.publishedDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    expect(screen.getByRole('cell', { name: formattedDate })).toBeInTheDocument();
  });

  test('Should render the platform', async () => {
    await renderComponent();

    expect(screen.getByRole('cell', { name: videoMock.platform })).toBeInTheDocument();
  });

  test('Should render the created and updated dates', async () => {
    await renderComponent();

    const formattedCreatedAt = videoMock.createdAt.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedUpdatedAt = videoMock.updatedAt.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    expect(screen.getAllByRole('cell', { name: formattedCreatedAt }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('cell', { name: formattedUpdatedAt }).length).toBeGreaterThan(0);
  });

  test('Should render the active status', async () => {
    await renderComponent();

    expect(screen.getByText('activo')).toBeInTheDocument();
    expect(screen.queryByText('desactivado')).not.toBeInTheDocument();
  });

  test('Should render the inactive status', async () => {
    mockFetchVideo.mockResolvedValue({
      ok: true,
      message: 'Video obtenido correctamente',
      video: videoInactiveMock,
    });

    await renderComponent();

    expect(screen.getByText('desactivado')).toBeInTheDocument();
    expect(screen.queryByText('activo')).not.toBeInTheDocument();
  });

  test('Should render a link to edit the video', async () => {
    await renderComponent();

    const editLink = screen.getByRole('link', { name: /ir a editar video/i });

    expect(editLink).toHaveAttribute(
      'href',
      ROUTES.ADMIN_VIDEOS_EDIT(videoMock.id),
    );
  });

  test('Should redirect when the video fetch fails', async () => {
    mockFetchVideo.mockResolvedValue({
      ok: false,
      message: 'Video no encontrada',
      video: null,
    });

    await expect(
      VideoView({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_VIDEOS}?error=${encodeURIComponent('Video no encontrada')}`,
    );
  });
});
