import { render, screen } from '@testing-library/react';
import { TournamentsView } from '@/app/admin/torneos/tournaments-view';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/admin',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('@/shared/components/search', () => ({
  Search: () => null,
}));

vi.mock('@/app/admin/torneos/(components)/create-tournament', () => ({
  CreateTournament: () => null,
}));

vi.mock('@/app/admin/torneos/(components)/tournaments-table', () => ({
  TournamentsTable: () => null,
}));

describe('Test on <TournamentsView /> component', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await TournamentsView({
      searchParams: Promise.resolve({
        query: undefined,
        page: undefined,
        error: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByText(/torneos/i)).toBeInTheDocument();
  });
});
