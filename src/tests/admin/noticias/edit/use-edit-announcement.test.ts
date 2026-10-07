import { renderHook, act } from '@testing-library/react';
import { useEditAnnouncement } from '@/app/admin/noticias/editar/[id]/use-edit-announcement';
import { ROUTES } from '@/shared/constants/routes';
import type { ANNOUNCEMENT_TYPE } from '@/app/admin/noticias/(actions)/fetchAnnouncementAction';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      announcementId: string;
    }) => Promise<{
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
  updateAnnouncementAction: mockUpdateAction,
}));

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const publishedDate = new Date('2026-01-15T12:00:00.000Z');

const announcement: ANNOUNCEMENT_TYPE = {
  id: announcementId,
  title: 'Noticia de Apertura',
  permalink: 'noticia-de-apertura',
  description: 'Descripción de la noticia',
  content: 'Contenido de la noticia',
  publishedDate,
  imageUrl: null,
  active: true,
};

const defaultProps = { announcement };

const validData = {
  title: 'Noticia Editada',
  permalink: 'noticia-editada',
  publishedDate,
  description: 'Descripción editada',
  content: 'Contenido editado',
  active: false,
};

describe('Tests on useEditAnnouncement hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'La noticia fue actualizada correctamente',
      announcement: { id: announcementId },
    });
  });

  test('Should initialize form with the announcement default values', () => {
    const { result } = renderHook(() => useEditAnnouncement(defaultProps));

    const values = result.current.form.getValues();

    expect(values.title).toBe(announcement.title);
    expect(values.permalink).toBe(announcement.permalink);
    expect(values.publishedDate).toEqual(announcement.publishedDate);
    expect(values.description).toBe(announcement.description);
    expect(values.content).toBe(announcement.content);
    expect(values.active).toBe(announcement.active);
  });

  test('handleRedirectBack should navigate to the announcements list', () => {
    const { result } = renderHook(() => useEditAnnouncement(defaultProps));

    act(() => result.current.handleRedirectBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_ANNOUNCEMENTS);
  });

  test('onSubmit should call updateAnnouncementAction with the correct params', async () => {
    const { result } = renderHook(() => useEditAnnouncement(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      formData: expect.any(FormData),
      announcementId,
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Noticia Editada');
    expect(formData.get('permalink')).toBe('noticia-editada');
    expect(formData.get('publishedDate')).toBe(publishedDate.toString());
    expect(formData.get('description')).toBe('Descripción editada');
    expect(formData.get('content')).toBe('Contenido editado');
    expect(formData.get('active')).toBe('false');
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditAnnouncement(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('La noticia fue actualizada correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_ANNOUNCEMENTS);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar la noticia',
      announcement: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditAnnouncement(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar la noticia');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
