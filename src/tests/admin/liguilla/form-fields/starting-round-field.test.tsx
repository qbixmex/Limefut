import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StartingRoundField } from '@/app/admin/liguilla/(components)/form-fields/starting-round-field';
import { CreatePlayoffsSchema } from '@/shared/schemas';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm<{ startingRound: string; tournament: string; category: string; teamsIds: string[] }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsSchema) as any,
    defaultValues: {
      tournament: '',
      category: '',
      teamsIds: [],
      startingRound: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const fieldValue = useWatch({ name: 'startingRound' });
  return <span data-testid="field-value">{fieldValue}</span>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger();
  }, [trigger]);
  return null;
}

function SetValidRound() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('startingRound', 'final', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <StartingRoundField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <StartingRoundField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox');
    const getOption = (name: string) => screen.findByRole('option', { name });

    return { user, combobox, getOption };
  };

  test('Should render correctly', () => {
    const { combobox } = renderComponent();

    const label = screen.getByText(/ronda inicial/i);

    expect(combobox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(screen.getByText(/seleccione ronda/i)).toBeInTheDocument();
  });

  test('Should update the value when selecting a round', async () => {
    const { user, combobox, getOption } = renderComponent(<FormValueDisplay />);

    await user.click(combobox);
    await user.click(await getOption('Final'));

    expect(screen.getByTestId('field-value')).toHaveTextContent('final');
  });

  test('Should show error when no round is selected', async () => {
    renderComponent(<TriggerValidation />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ronda inicial es obligatoria/i);
  });

  test('Should not show error when a valid round is selected', async () => {
    const { combobox } = renderComponent(<SetValidRound />);

    await waitFor(() => {
      expect(combobox).toHaveTextContent('Final');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
