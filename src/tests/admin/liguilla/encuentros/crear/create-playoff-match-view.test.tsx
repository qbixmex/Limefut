import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { CreatePlayoffMatchView } from '@/app/admin/liguilla/[playoff_id]/encuentros/crear/create-playoff-match-view';

const formProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/crear/create-playoffs-match-form', () => ({
  CreatePlayoffsMatchForm: (props: {
    playoffId: string;
    teamsSlot: ReactElement;
    fieldsSlot: ReactElement;
  }) => {
    formProps.current = props;
    return <div data-testid="create-playoffs-match-form" />;
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/teams-slot', () => ({
  TeamsSlot: () => <span data-testid="teams-slot" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/fields-slot', () => ({
  FieldsSlot: () => <span data-testid="fields-slot" />,
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Test on <CreatePlayoffMatchView />', () => {
  beforeEach(() => {
    formProps.current = undefined;
  });

  const renderComponent = async () => {
    const ServerComponent = await CreatePlayoffMatchView({
      params: Promise.resolve({ playoff_id: playoffId }),
    });
    return render(ServerComponent);
  };

  test('Should render <CreatePlayoffsMatchForm />', async () => {
    await renderComponent();

    const matchForm = screen.getByTestId('create-playoffs-match-form');

    expect(matchForm).toBeInTheDocument();
  });

  test('Should pass the playoff id and slots to the form', async () => {
    await renderComponent();

    const props = formProps.current as {
      playoffId: string;
      teamsSlot: ReactElement & { props: { playoffId: string } };
      fieldsSlot: ReactElement;
    };

    expect(props.playoffId).toBe(playoffId);
    expect(props.teamsSlot.props.playoffId).toBe(playoffId);
    expect(props.fieldsSlot).toBeTruthy();
  });
});
