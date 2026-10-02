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
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <StartingRoundField />
      </TestWrapper>,
    );

    const combobox = screen.getByRole('combobox');
    const label = screen.getByText(/ronda inicial/i);

    expect(combobox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(screen.getByText(/seleccione ronda/i)).toBeInTheDocument();
  });

  test('Should update the value when selecting a round', async () => {
    render(
      <TestWrapper>
        <StartingRoundField />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Final' }));

    expect(screen.getByTestId('field-value')).toHaveTextContent('final');
  });

  test('Should show error when no round is selected', async () => {
    render(
      <TestWrapper>
        <StartingRoundField />
        <TriggerValidation />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ronda inicial es obligatoria/i);
  });

  test('Should not show error when a valid round is selected', async () => {
    render(
      <TestWrapper>
        <StartingRoundField />
        <SetValidRound />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Final');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
