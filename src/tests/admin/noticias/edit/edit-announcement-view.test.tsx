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

vi.mock('@/app/admin/noticias/editar/[id]/edit-announcement.form', () => ({
  EditAnnouncementForm: () => <span data-testid="edit-announcement-form" />,
}));

import { render, screen } from '@testing-library/react';
import { EditAnnouncementView } from '@/app/admin/noticias/editar/[id]/edit-announcement-view';
import { ROUTES } from '@/shared/constants/routes';
import { announcementMock } from '../mocks/announcement.mock';

describe('Tests on <EditAnnouncementContent />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAnnouncement.mockResolvedValue({
      ok: true,
      message: 'Noticia obtenida correctamente',
      announcement: announcementMock,
    });
  });

  test('Should render <EditAnnouncementForm /> when fetch succeeds', async () => {
    const serverComponent = await EditAnnouncementView({
      params: Promise.resolve({ id: announcementMock.id }),
    });
    render(serverComponent);

    const form = screen.getByTestId('edit-announcement-form');

    expect(form).toBeInTheDocument();
  });

  test('Should fetch the announcement with the given id', async () => {
    const serverComponent = await EditAnnouncementView({
      params: Promise.resolve({ id: announcementMock.id }),
    });
    render(serverComponent);

    expect(mockFetchAnnouncement).toHaveBeenCalledWith(announcementMock.id);
  });

  test('Should redirect when fetch fails', async () => {
    mockFetchAnnouncement.mockResolvedValue({
      ok: false,
      message: 'Noticia no encontrada',
      announcement: null,
    });

    await expect(
      EditAnnouncementView({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_ANNOUNCEMENTS}?error=${encodeURIComponent('La noticia no existe')}`,
    );
  });
});
