import { render, screen } from '@testing-library/react';
import PlayoffPage from '@/app/admin/liguilla/[playoff_id]/page';

const mockedDetailsView = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/liguilla/[playoff_id]/playoff-details-view', () => ({
  PlayOffDetailsView: (props: { params: Promise<{ playoff_id: string }> }) => {
    mockedDetailsView(props);
    return <div data-testid="playoff-details-view" />;
  },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Tests on <PlayoffPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = (params = Promise.resolve({ playoff_id: playoffId })) => {
    return render(<PlayoffPage params={params} />);
  };

  test('Should render the page title', () => {
    renderPage();

    expect(screen.getByText(/detalles de la liguilla/i)).toBeInTheDocument();
  });

  test('Should render <PlayOffDetailsView />', () => {
    renderPage();

    const details = screen.getByTestId('playoff-details-view');

    expect(details).toBeInTheDocument();
  });

  test('Should pass the params promise to <PlayOffDetailsView />', async () => {
    const params = Promise.resolve({ playoff_id: playoffId });
    renderPage(params);

    const props = mockedDetailsView.mock.calls[0][0] as {
      params: Promise<{ playoff_id: string }>;
    };

    await expect(props.params).resolves.toEqual({ playoff_id: playoffId });
  });
});
