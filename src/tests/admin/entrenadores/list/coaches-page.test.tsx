import CoachesPage from '@/app/admin/entrenadores/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/entrenadores/coaches-view', () => ({
  CoachesPageView: () => <div data-testid="coaches-view" />,
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on coaches page', () => {
  test('Should render correctly', async () => {
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
