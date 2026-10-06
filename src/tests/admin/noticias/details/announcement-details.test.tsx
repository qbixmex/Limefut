const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

const mockFetchAnnouncement = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/noticias/(actions)', () => ({
  fetchAnnouncementAction: mockFetchAnnouncement,
}));

import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnnouncementContent } from '@/app/admin/noticias/[id]/page';
import { ROUTES } from '@/shared/constants/routes';
import {
  announcementMock,
  announcementInactiveMock,
  announcementWithoutImageMock,
} from '../mocks/announcement.mock';

describe('Tests on <AnnouncementContent />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAnnouncement.mockResolvedValue({
      ok: true,
      message: 'Noticia obtenida correctamente',
      announcement: announcementMock,
    });
  });

  const renderComponent = async (announcementId = announcementMock.id) => {
    const element = await AnnouncementContent({
      params: Promise.resolve({ id: announcementId }),
    });
    return render(element, { wrapper: TooltipProvider });
  };

  test('Should render the announcement information', async () => {
    await renderComponent();

    expect(screen.getByRole('heading', { name: /detalles de la noticia/i })).toBeInTheDocument();
    expect(mockFetchAnnouncement).toHaveBeenCalledWith(announcementMock.id);
  });

  test('Should render the title, permalink and description', async () => {
    await renderComponent();

    expect(screen.getByRole('cell', { name: announcementMock.title })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: announcementMock.permalink })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: announcementMock.description })).toBeInTheDocument();
  });

  test('Should render the publication date', async () => {
    await renderComponent();

    const formattedDate = announcementMock.publishedDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    expect(screen.getByRole('cell', { name: formattedDate })).toBeInTheDocument();
  });

  test('Should render the active status', async () => {
    await renderComponent();

    expect(screen.getByText('activo')).toBeInTheDocument();
    expect(screen.queryByText('desactivado')).not.toBeInTheDocument();
  });

  test('Should render the inactive status', async () => {
    mockFetchAnnouncement.mockResolvedValue({
      ok: true,
      message: 'Noticia obtenida correctamente',
      announcement: announcementInactiveMock,
    });

    await renderComponent();

    expect(screen.getByText('desactivado')).toBeInTheDocument();
    expect(screen.queryByText('activo')).not.toBeInTheDocument();
  });

  test('Should render the announcement image when present', async () => {
    await renderComponent();

    const image = screen.getByRole('img', { name: `${announcementMock.title} imagen` });

    expect(image).toBeInTheDocument();
  });

  test('Should not render an image when the announcement has no image', async () => {
    mockFetchAnnouncement.mockResolvedValue({
      ok: true,
      message: 'Noticia obtenida correctamente',
      announcement: announcementWithoutImageMock,
    });

    await renderComponent();

    const image = screen.queryByRole('img', { name: `${announcementWithoutImageMock.title} imagen` });

    expect(image).not.toBeInTheDocument();
  });

  test('Should render the content', async () => {
    await renderComponent();

    expect(screen.getByText('Texto de la noticia de apertura')).toBeInTheDocument();
  });

  test('Should render a link to edit the announcement', async () => {
    await renderComponent();

    const editLink = screen.getByRole('link', { name: /editar noticia/i });

    expect(editLink).toHaveAttribute(
      'href',
      ROUTES.ADMIN_ANNOUNCEMENTS_EDIT(announcementMock.id),
    );
  });

  test('Should redirect when the announcement fetch fails', async () => {
    mockFetchAnnouncement.mockResolvedValue({
      ok: false,
      message: 'Noticia no encontrada',
      announcement: null,
    });

    await expect(
      AnnouncementContent({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_ANNOUNCEMENTS}?error=${encodeURIComponent('Noticia no encontrada')}`,
    );
  });
});
