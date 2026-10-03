import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { VisitorTeamSelectField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/visitor-team-select-field';
import { playoffTeamsForSelectMock } from '../mocks/playoff-teams.mock';

function TestWrapper({
  children,
  localTeamId = '',
}: Readonly<{ children: ReactNode; localTeamId?: string }>) {
  const form = useForm({
    defaultValues: { localTeamId, visitorTeamId: '' },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const visitorTeamId = useWatch({ name: 'visitorTeamId' });
  return <span data-testid="visitor-value">{visitorTeamId}</span>;
}

describe('Test on <VisitorTeamSelectField />', () => {
  const renderComponent = (teams = playoffTeamsForSelectMock, localTeamId = '', extra?: ReactNode) => {
    render(
      <TestWrapper localTeamId={localTeamId}>
        <VisitorTeamSelectField teams={teams} />
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

    expect(screen.getByText('Equipo Visitante')).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(screen.getByText(/seleccione equipo visitante/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting a team', async () => {
    const { user, combobox, getOption } = renderComponent(
      playoffTeamsForSelectMock,
      '',
      <FormValueDisplay />,
    );

    await user.click(combobox());
    await user.click(await getOption(playoffTeamsForSelectMock[1].name));

    expect(screen.getByTestId('visitor-value')).toHaveTextContent(playoffTeamsForSelectMock[1].id);
  });

  test('Should disable the team already selected as local', async () => {
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
