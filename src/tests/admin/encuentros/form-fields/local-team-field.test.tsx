import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { LocalTeamField } from '@/app/admin/encuentros/(components)/form-fields/local-team-field';
import { teamsForMatchMock } from '../mocks/teams-for-match.mock';
import { AMERICA, CRUZ_AZUL } from '../mocks/teams.mock';

function TestWrapper({
  children,
  visitorTeamId = '',
}: {
  children: ReactNode;
  visitorTeamId?: string;
}) {
  const form = useForm({
    defaultValues: { localTeamId: '', visitorTeamId },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const localTeamId = useWatch({ name: 'localTeamId' });
  return (
    <span data-testid="local-value">
      {localTeamId}
    </span>
  );
}

describe('Test on <LocalTeamField />', () => {
  const renderComponent = (
    teams = teamsForMatchMock,
    visitorTeamId = '',
    extra?: ReactNode,
  ) => {
    render(
      <TestWrapper visitorTeamId={visitorTeamId}>
        <LocalTeamField teams={teams} match={undefined} />
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

    const label = screen.getByText(/equipo local/i);
    expect(label).toBeInTheDocument();

    expect(combobox()).toBeInTheDocument();

    const placeholder = screen.getByText(/seleccione un equipo/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('Should update the form value when selecting a team', async () => {
    const { user, combobox, getOption } = renderComponent(
      teamsForMatchMock,
      '',
      <FormValueDisplay />,
    );

    await user.click(combobox());
    const localTeamName = await getOption(AMERICA.name);
    await user.click(localTeamName);

    const localValue = screen.getByTestId('local-value');

    expect(localValue).toHaveTextContent(AMERICA.id);
  });

  test('Should disable the team already selected as visitor', async () => {
    const { user, combobox } = renderComponent(
      teamsForMatchMock,
      CRUZ_AZUL.id,
    );

    await user.click(combobox());

    const option = await screen.findByRole('option', {
      name: CRUZ_AZUL.name,
    });

    expect(option).toHaveAttribute('aria-disabled', 'true');
  });
});
