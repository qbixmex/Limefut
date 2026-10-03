import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { RoundSelectField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/round-select-field';

function TestWrapper({ children, round = '' }: Readonly<{ children: ReactNode; round?: string }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round,
      group: '',
      localTeamScore: 0,
      visitorTeamScore: 0,
      status: undefined,
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
  const round = useWatch({ name: 'round' });
  return <span data-testid="round-value">{round}</span>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger('round');
  }, [trigger]);
  return null;
}

describe('Test on <RoundSelectField />', () => {
  const renderComponent = (round = '', extra?: ReactNode) => {
    render(
      <TestWrapper round={round}>
        <RoundSelectField />
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

    expect(screen.getByText('Ronda')).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(screen.getByText(/seleccione ronda/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting a round', async () => {
    const { user, combobox, getOption } = renderComponent('', <FormValueDisplay />);

    await user.click(combobox());
    await user.click(await getOption('Final'));

    expect(screen.getByTestId('round-value')).toHaveTextContent('final');
  });

  test('Should show an error when no round is selected', async () => {
    renderComponent('', <TriggerValidation />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/debes seleccionar una ronda/i);
  });

  test('Should not show an error when a round is selected', async () => {
    renderComponent('final', <TriggerValidation />);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
