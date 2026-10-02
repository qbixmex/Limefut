const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/(actions)/fetch-playoffs.action', () => ({
  fetchPlayoffsAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/playoffs-table', () => ({
  PlayoffsTable: () => <div data-testid="playoffs-table" />,
}));

import { PlayoffsView } from '@/app/admin/liguilla/playoffs-view';
import { render, screen } from '@testing-library/react';
import { fetchPlayoffsAction } from '@/app/admin/liguilla/(actions)/fetch-playoffs.action';
import { playoffsMock } from '../mocks/playoffs.mock';
import { ROUTES } from '@/shared/constants/routes';

type SearchParams = { query?: string; page?: string };

const defaultResponse = {
  ok: true,
  message: 'La liguilla fue obtenida correctamente',
  playoffs: playoffsMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

describe('Tests on <PlayoffsView />', () => {
  const renderComponent = async (searchParams: SearchParams = {}) => {
    vi.mocked(fetchPlayoffsAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayoffsView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <PlayoffsTable /> when fetch succeeds', async () => {
    await renderComponent();

    const table = screen.getByTestId('playoffs-table');

    expect(table).toBeInTheDocument();
  });

  test('Should call fetchPlayoffsAction with default page', async () => {
    await renderComponent();

    expect(vi.mocked(fetchPlayoffsAction)).toHaveBeenCalledWith({
      page: 1,
      query: undefined,
    });
  });

  test('Should call fetchPlayoffsAction with parsed page and query', async () => {
    await renderComponent({ page: '2', query: 'apertura' });

    expect(vi.mocked(fetchPlayoffsAction)).toHaveBeenCalledWith({
      page: 2,
      query: 'apertura',
    });
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchPlayoffsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los encuentros de liguilla',
      playoffs: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    });

    await expect(async () => {
      await PlayoffsView({ searchParams: Promise.resolve({}) });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS}?error=${
        encodeURIComponent('Error al obtener los encuentros de liguilla')
      }`,
    );
  });
});
