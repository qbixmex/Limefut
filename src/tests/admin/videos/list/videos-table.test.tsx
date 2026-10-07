const { mockGetSession, mockFetchVideos, mockUpdateState } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFetchVideos: vi.fn(),
  mockUpdateState: vi.fn(),
}));

let deleteVideoProps: Record<string, unknown> | undefined;

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/videos/(actions)', () => ({
  fetchVideosAction: mockFetchVideos,
  updateVideoStateAction: mockUpdateState,
}));

vi.mock('@/app/admin/videos/(components)/edit-video', () => ({
  EditVideo: () => <span data-testid="edit-video" />,
}));

vi.mock('@/app/admin/videos/(components)/delete-video', () => ({
  DeleteVideo: (props: Record<string, unknown>) => {
    deleteVideoProps = props;
    return <span data-testid="delete-video" />;
  },
}));

vi.mock('@/app/admin/videos/(components)/show-video-details', () => ({
  ShowVideoDetails: () => <span data-testid="show-video-details" />,
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
import { VideosTable } from '@/app/admin/videos/(components)/videos-table';
import { videosMock } from '../mocks/videos.mock';

const defaultResponse = {
  ok: true,
  message: 'Los videos fueron obtenidos correctamente',
  videos: videosMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const formatDate = (date: Date) => format(date, "d 'de' MMMM 'del' y", { locale: es });

describe('Tests on <VideosTable />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteVideoProps = undefined;
    mockGetSession.mockResolvedValue({ user: { roles: ['admin'] } });
    mockFetchVideos.mockResolvedValue(defaultResponse);
  });

  const renderComponent = async ({
    query = '',
    currentPage = '1',
  }: { query?: string; currentPage?: string } = {}) => {
    const ServerComponent = await VideosTable({ query, currentPage });
    return render(ServerComponent);
  };

  test('Should render the table', async () => {
    await renderComponent();

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
  });

  test('Should render the table columns', async () => {
    await renderComponent();

    expect(screen.getByRole('columnheader', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Fecha de publicación' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Plataforma' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Activo' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
  });

  test('Should render each video title', async () => {
    await renderComponent();

    videosMock.forEach((video) => {
      expect(screen.getByText(video.title)).toBeInTheDocument();
    });
  });

  test('Should render the formatted publication date', async () => {
    await renderComponent();

    videosMock.forEach((video) => {
      expect(screen.getByText(formatDate(video.publishedDate))).toBeInTheDocument();
    });
  });

  test('Should render each video platform', async () => {
    await renderComponent();

    videosMock.forEach((video) => {
      expect(screen.getByText(video.platform)).toBeInTheDocument();
    });
  });

  test('Should render the action buttons and the active switch per row', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('show-video-details')).toHaveLength(videosMock.length);
    expect(screen.getAllByTestId('edit-video')).toHaveLength(videosMock.length);
    expect(screen.getAllByTestId('delete-video')).toHaveLength(videosMock.length);
    expect(screen.getAllByTestId('active-switch')).toHaveLength(videosMock.length);
  });

  test('Should pass the session roles to <DeleteVideo />', async () => {
    await renderComponent();

    expect(deleteVideoProps).toEqual(expect.objectContaining({ roles: ['admin'] }));
  });

  test('Should call fetchVideosAction with the pagination params', async () => {
    await renderComponent({ query: 'apertura', currentPage: '2' });

    expect(mockFetchVideos).toHaveBeenCalledWith({
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
    mockFetchVideos.mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).not.toHaveClass('hidden');
  });

  test('Should render the empty state when there are no videos', async () => {
    mockFetchVideos.mockResolvedValue({ ...defaultResponse, videos: [] });

    await renderComponent();

    const emptyMessage = screen.getByText('No hay videos disponibles');
    const table = screen.queryByRole('table');

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });
});
