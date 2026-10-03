import { render, screen } from '@testing-library/react';
import { PlayoffMatchDetailsPage } from '@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/page';

const editMatchProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/playoff-match-view', () => ({
  PlayoffMatchView: () => <div data-testid="playoff-match-view" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/edit-match', () => ({
  EditMatch: (props: unknown) => {
    editMatchProps.current = props;
    return <span data-testid="edit-match" />;
  },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <PlayoffMatchDetailsPage />', () => {
  beforeEach(() => {
    editMatchProps.current = undefined;
  });

  const renderPage = async () => {
    const ServerComponent = await PlayoffMatchDetailsPage({
      params: Promise.resolve({ playoff_id: playoffId, match_id: matchId }),
    });
    return render(ServerComponent);
  };

  test('Should render the title', async () => {
    await renderPage();

    expect(screen.getByText(/^encuentro$/i)).toBeInTheDocument();
  });

  test('Should render <EditMatch /> with the ids', async () => {
    await renderPage();

    expect(screen.getByTestId('edit-match')).toBeInTheDocument();
    expect(editMatchProps.current).toEqual({ playoffId, matchId });
  });

  test('Should render <PlayoffMatchView />', async () => {
    await renderPage();

    expect(screen.getByTestId('playoff-match-view')).toBeInTheDocument();
  });
});
