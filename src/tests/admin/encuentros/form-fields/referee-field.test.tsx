import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatchSchema } from '@/shared/schemas';
import { RefereeField } from '@/app/admin/encuentros/(components)/form-fields/referee-field';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';

function TestWrapper({
  children,
  referee = '',
}: Readonly<{ children: ReactNode; referee?: string }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMatchSchema) as any,
    defaultValues: {
      localTeamId: AMERICA.id,
      localScore: 0,
      visitorTeamId: CHIVAS.id,
      visitorScore: 0,
      fieldId: '',
      referee,
      status: 'scheduled',
      week: 0,
      tournament: LIGA_MX.permalink,
      category: SUB_15.permalink,
    },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const referee = useWatch({ name: 'referee' });

  return (
    <span data-testid="referee-value">
      {referee}
    </span>
  );
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger('referee');
  }, [trigger]);
  return null;
}

describe('Test on <RefereeField />', () => {
  const renderComponent = (referee = '', extra?: ReactNode) => {
    render(
      <TestWrapper referee={referee}>
        <RefereeField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const input = () => screen.getByRole('textbox');

    return { user, input };
  };

  test('Should render the label and input', () => {
    const { input } = renderComponent();

    expect(input()).toBeInTheDocument();

    const label = screen.getByText(/arbitro/i);
    expect(label).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, input } = renderComponent('', <FormValueDisplay />);

    await user.type(input(), 'Fernando García');

    await waitFor(() => {
      const referee = screen.getByTestId('referee-value');
      expect(referee).toHaveTextContent('Fernando García');
    });
  });

  test('Should show an error when the referee is too short', async () => {
    renderComponent('ab', <TriggerValidation />);

    const inputError = await screen.findByRole('alert');

    expect(inputError).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show an error for an empty referee', async () => {
    renderComponent('', <TriggerValidation />);

    await waitFor(() => {
      const inputError = screen.queryByRole('alert');

      expect(inputError).not.toBeInTheDocument();
    });
  });
});
