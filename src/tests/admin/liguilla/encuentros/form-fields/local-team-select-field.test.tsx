import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { LocalTeamSelectField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-team-select-field';
import { playoffTeamsForSelectMock } from '../mocks/playoff-teams.mock';

function TestWrapper({
  children,
  visitorTeamId = '',
}: Readonly<{ children: ReactNode; visitorTeamId?: string }>) {
  const form = useForm({
    defaultValues: { localTeamId: '', visitorTeamId },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const localTeamId = useWatch({ name: 'localTeamId' });
  return <span data-testid="local-value">{localTeamId}</span>;
}

describe('Test on <LocalTeamSelectField />', () => {
  const renderComponent = (teams = playoffTeamsForSelectMock, visitorTeamId = '', extra?: ReactNode) => {
    render(
      <TestWrapper visitorTeamId={visitorTeamId}>
        <LocalTeamSelectField teams={teams} />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox');
    const getOption = (name: string) => screen.findByRole('option', { name });

    return { user, combobox, getOption };
  };

  test('Should render the label and placeholder', () => {
    const { combobox } = renderComponent();

    expect(screen.getByText('Equipo Local')).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(screen.getByText(/seleccione equipo local/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting a team', async () => {
    const { user, combobox, getOption } = renderComponent(
      playoffTeamsForSelectMock,
      '',
      <FormValueDisplay />,
    );

    await user.click(combobox());
    await user.click(await getOption(playoffTeamsForSelectMock[0].name));

    expect(screen.getByTestId('local-value')).toHaveTextContent(playoffTeamsForSelectMock[0].id);
  });

  test('Should disable the team already selected as visitor', async () => {
    const { user, combobox } = renderComponent(
      playoffTeamsForSelectMock,
      playoffTeamsForSelectMock[0].id,
    );

    await user.click(combobox());

    const option = await screen.findByRole('option', { name: playoffTeamsForSelectMock[0].name });
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });

  test('Should disable the select when there are no teams', () => {
    const { combobox } = renderComponent([]);

    expect(combobox()).toBeDisabled();
  });
});
