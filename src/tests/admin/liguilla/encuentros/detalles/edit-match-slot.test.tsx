import { render, screen } from '@testing-library/react';
import { EditMatchSlot } from '@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/edit-match-slot';

const editMatchProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/edit-match', () => ({
  EditMatch: (props: unknown) => {
    editMatchProps.current = props;
    return <span data-testid="edit-match" />;
  },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Tests on <EditMatchSlot />', () => {
  beforeEach(() => {
    editMatchProps.current = undefined;
  });

  test('Should resolve the params and render <EditMatch /> with the ids', async () => {
    const element = await EditMatchSlot({
      params: Promise.resolve({ playoff_id: playoffId, match_id: matchId }),
    });

    render(element);

    expect(screen.getByTestId('edit-match')).toBeInTheDocument();
    expect(editMatchProps.current).toEqual({ playoffId, matchId });
  });
});
