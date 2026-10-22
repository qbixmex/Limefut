import { render, screen } from '@testing-library/react';
import { PlayoffMatchDetailsPage } from '@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/page';

const editMatchSlotProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/playoff-match-view', () => ({
  PlayoffMatchView: () => <div data-testid="playoff-match-view" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/edit-match-slot', () => ({
  EditMatchSlot: (props: unknown) => {
    editMatchSlotProps.current = props;
    return <span data-testid="edit-match" />;
  },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <PlayoffMatchDetailsPage />', () => {
  beforeEach(() => {
    editMatchSlotProps.current = undefined;
  });

  const renderPage = () => {
    const ServerComponent = PlayoffMatchDetailsPage({
      params: Promise.resolve({ playoff_id: playoffId, match_id: matchId }),
    });
    return render(ServerComponent);
  };

  test('Should render the title', async () => {
    await renderPage();

    expect(screen.getByText(/^encuentro$/i)).toBeInTheDocument();
  });

  test('Should render <EditMatchSlot />', async () => {
    await renderPage();

    expect(screen.getByTestId('edit-match')).toBeInTheDocument();
  });

  test('Should pass params to <EditMatchSlot />', async () => {
    await renderPage();

    const props = editMatchSlotProps.current as {
      params: Promise<{ playoff_id: string; match_id: string }>;
    };

    await expect(props.params).resolves.toEqual({
      playoff_id: playoffId,
      match_id: matchId,
    });
  });

  test('Should render <PlayoffMatchView />', async () => {
    await renderPage();

    expect(screen.getByTestId('playoff-match-view')).toBeInTheDocument();
  });
});
