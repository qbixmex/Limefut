import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { VisitorTeamField } from '@/app/admin/encuentros/(components)/form-fields/visitor-team-field';
import { teamsForMatchMock } from '../mocks/teams-for-match.mock';
import { AMERICA, CRUZ_AZUL } from '../mocks/teams.mock';

function TestWrapper({
  children,
  localTeamId = '',
}: {
  children: ReactNode;
  localTeamId?: string;
}) {
  const form = useForm({
    defaultValues: { localTeamId, visitorTeamId: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const visitorTeamId = useWatch({ name: 'visitorTeamId' });

  return (
    <span data-testid="visitor-value">
      {visitorTeamId}
    </span>
  );
}

describe('Test on <VisitorTeamField />', () => {
  const renderComponent = (
    teams = teamsForMatchMock,
    localTeamId = '',
    extra?: ReactNode,
  ) => {
    render(
      <TestWrapper localTeamId={localTeamId}>
        <VisitorTeamField teams={teams} match={undefined} />
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

    const label = screen.getByText(/equipo visitante/i);
    expect(label).toBeInTheDocument();

    expect(combobox()).toBeInTheDocument();

    const placeholder = screen.getByText(/selecciona un equipo/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('Should update the form value when selecting a team', async () => {
    const { user, combobox, getOption } = renderComponent(
      teamsForMatchMock,
      '',
      <FormValueDisplay />,
    );

    await user.click(combobox());
    await user.click(await getOption(CRUZ_AZUL.name));

    expect(screen.getByTestId('visitor-value')).toHaveTextContent(CRUZ_AZUL.id);
  });

  test('Should disable the team already selected as local', async () => {
    const { user, combobox } = renderComponent(
      teamsForMatchMock,
      AMERICA.id,
    );

    await user.click(combobox());

    const option = await screen.findByRole('option', { name: AMERICA.name });
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });
});
