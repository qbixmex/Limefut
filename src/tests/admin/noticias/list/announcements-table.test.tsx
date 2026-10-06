const { mockGetSession, mockFetchAnnouncements, mockUpdateState } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFetchAnnouncements: vi.fn(),
  mockUpdateState: vi.fn(),
}));

let deleteAnnouncementProps: Record<string, unknown> | undefined;

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/noticias/(actions)', () => ({
  fetchAnnouncementsAction: mockFetchAnnouncements,
  updateAnnouncementStateAction: mockUpdateState,
}));

vi.mock('@/app/admin/noticias/(components)/edit-announcement', () => ({
  EditAnnouncement: () => <span data-testid="edit-announcement" />,
}));

vi.mock('@/app/admin/noticias/(components)/delete-announcement', () => ({
  DeleteAnnouncement: (props: Record<string, unknown>) => {
    deleteAnnouncementProps = props;
    return <span data-testid="delete-announcement" />;
  },
}));

vi.mock('@/app/admin/noticias/(components)/show-announcement-details', () => ({
  ShowAnnouncementDetails: () => <span data-testid="show-announcement-details" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AnnouncementsTable } from '@/app/admin/noticias/(components)/announcements-table';
import { announcementsMock } from '../mocks/announcements.mock';

const defaultResponse = {
  ok: true,
  message: 'Los patrocinadores fueron obtenidos correctamente',
  announcements: announcementsMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const formatDate = (date: Date) => format(date, "d 'de' MMMM 'del' y", { locale: es });

describe('Tests on <AnnouncementsTable />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteAnnouncementProps = undefined;
    mockGetSession.mockResolvedValue({ user: { roles: ['admin'] } });
    mockFetchAnnouncements.mockResolvedValue(defaultResponse);
  });

  const renderComponent = async ({
    query = '',
    currentPage = '1',
  }: { query?: string; currentPage?: string } = {}) => {
    const ServerComponent = await AnnouncementsTable({ query, currentPage });
    return render(ServerComponent);
  };

  test('Should render the table', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: 'Lista de noticias' });

    expect(table).toBeInTheDocument();
  });

  test('Should render the table columns', async () => {
    await renderComponent();

    expect(screen.getByRole('columnheader', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Fecha de publicación' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Activo' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
  });

  test('Should render the empty state when there are no announcements', async () => {
    mockFetchAnnouncements.mockResolvedValue({ ...defaultResponse, announcements: [] });

    await renderComponent();

    const emptyMessage = screen.getByText('No hay noticias disponibles');
    const table = screen.queryByRole('table', { name: 'Lista de noticias' });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render each announcement title', async () => {
    await renderComponent();

    announcementsMock.forEach((announcement) => {
      expect(screen.getByText(announcement.title)).toBeInTheDocument();
    });
  });

  test('Should render the formatted publication date', async () => {
    await renderComponent();

    announcementsMock.forEach((announcement) => {
      expect(screen.getByText(formatDate(announcement.publishedDate))).toBeInTheDocument();
    });
  });

  test('Should render the action buttons and the active switch per row', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('show-announcement-details')).toHaveLength(announcementsMock.length);
    expect(screen.getAllByTestId('edit-announcement')).toHaveLength(announcementsMock.length);
    expect(screen.getAllByTestId('delete-announcement')).toHaveLength(announcementsMock.length);
    expect(screen.getAllByTestId('active-switch')).toHaveLength(announcementsMock.length);
  });

  test('Should pass the session roles to <DeleteAnnouncement />', async () => {
    await renderComponent();

    expect(deleteAnnouncementProps).toEqual(expect.objectContaining({ roles: ['admin'] }));
  });

  test('Should call fetchAnnouncementsAction with the pagination params', async () => {
    await renderComponent({ query: 'apertura', currentPage: '2' });

    expect(mockFetchAnnouncements).toHaveBeenCalledWith({
      page: '2',
      take: 12,
      searchTerm: 'apertura',
    });
  });

  test('Should hide the pagination when there is a single page', async () => {
    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).toHaveClass('hidden');
  });

  test('Should show the pagination when there are multiple pages', async () => {
    mockFetchAnnouncements.mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).not.toHaveClass('hidden');
  });
});
