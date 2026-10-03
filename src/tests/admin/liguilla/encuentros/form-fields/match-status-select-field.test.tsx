import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { MatchStatusSelectField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/match-status-select-field';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';

function TestWrapper({
  children,
  status,
}: Readonly<{ children: ReactNode; status?: MATCH_STATUS_TYPE }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round: '',
      group: '',
      localTeamScore: 0,
      visitorTeamScore: 0,
      status,
      referee: '',
      remarks: '',
      localTeamId: '',
      visitorTeamId: '',
      fieldId: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const status = useWatch({ name: 'status' });
  return <span data-testid="status-value">{status}</span>;
}

describe('Test on <MatchStatusSelectField />', () => {
  const renderComponent = (status?: MATCH_STATUS_TYPE, extra?: ReactNode) => {
    render(
      <TestWrapper status={status}>
        <MatchStatusSelectField />
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

    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(screen.getByText(/seleccione estado/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting a status', async () => {
    const { user, combobox, getOption } = renderComponent(undefined, <FormValueDisplay />);

    await user.click(combobox());
    await user.click(await getOption('programado'));

    expect(screen.getByTestId('status-value')).toHaveTextContent(MATCH_STATUS.SCHEDULED);
  });

  test('Should render a static label when the status is completed', () => {
    renderComponent(MATCH_STATUS.COMPLETED, <FormValueDisplay />);

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('completado')).toBeInTheDocument();
  });
});
