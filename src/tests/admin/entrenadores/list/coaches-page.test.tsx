import CoachesPage from '@/app/admin/entrenadores/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/create-coach', () => ({
  CreateCoach: () => <div data-testid="create-coach" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/entrenadores/coaches-view', () => ({
  CoachesPageView: () => <div data-testid="coaches-view" />,
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on coaches page', () => {
  test('Should render heading', async () => {
    const ServerComponent = await CoachesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/entrenadores/i);
  });

  test('Should render <Search /> and <CreateCoach /> components', async () => {
    const ServerComponent = await CoachesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('create-coach')).toBeInTheDocument();
  });

  test('Should render <CoachesPageView /> component', async () => {
    const ServerComponent = await CoachesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const coachesView = screen.getByTestId('coaches-view');

    expect(coachesView).toBeInTheDocument();
  });
});
