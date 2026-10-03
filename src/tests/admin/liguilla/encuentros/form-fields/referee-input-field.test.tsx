import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { RefereeInputField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/referee-input-field';

function TestWrapper({ children, referee = '' }: Readonly<{ children: ReactNode; referee?: string }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round: '',
      group: '',
      localTeamScore: 0,
      visitorTeamScore: 0,
      status: undefined,
      referee,
      remarks: '',
      localTeamId: '',
      visitorTeamId: '',
      fieldId: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const referee = useWatch({ name: 'referee' });
  return <span data-testid="referee-value">{referee}</span>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger('referee');
  }, [trigger]);
  return null;
}

describe('Test on <RefereeInputField />', () => {
  const renderComponent = (referee = '', extra?: ReactNode) => {
    render(
      <TestWrapper referee={referee}>
        <RefereeInputField />
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
    expect(screen.getByText(/arbitro/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, input } = renderComponent('', <FormValueDisplay />);

    await user.type(input(), 'John Doe');

    await waitFor(() => {
      expect(screen.getByTestId('referee-value')).toHaveTextContent('John Doe');
    });
  });

  test('Should show an error when the referee is too short', async () => {
    renderComponent('ab', <TriggerValidation />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show an error for an empty referee', async () => {
    renderComponent('', <TriggerValidation />);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
