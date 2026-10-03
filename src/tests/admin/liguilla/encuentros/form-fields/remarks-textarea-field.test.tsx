import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { RemarksTextAreaField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/remarks-textarea-field';

function TestWrapper({ children, remarks = '' }: Readonly<{ children: ReactNode; remarks?: string }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round: '',
      group: '',
      localTeamScore: 0,
      visitorTeamScore: 0,
      status: undefined,
      referee: '',
      remarks,
      localTeamId: '',
      visitorTeamId: '',
      fieldId: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const remarks = useWatch({ name: 'remarks' });
  return <span data-testid="remarks-value">{remarks}</span>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger('remarks');
  }, [trigger]);
  return null;
}

describe('Test on <RemarksTextAreaField />', () => {
  const renderComponent = (remarks = '', extra?: ReactNode) => {
    render(
      <TestWrapper remarks={remarks}>
        <RemarksTextAreaField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textarea = () => screen.getByRole('textbox');

    return { user, textarea };
  };

  test('Should render the label and textarea', () => {
    const { textarea } = renderComponent();

    expect(textarea()).toBeInTheDocument();
    expect(screen.getByText(/comentarios/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, textarea } = renderComponent('', <FormValueDisplay />);

    await user.type(textarea(), 'Sin novedades');

    await waitFor(() => {
      expect(screen.getByTestId('remarks-value')).toHaveTextContent('Sin novedades');
    });
  });

  test('Should show an error when the remarks are too short', async () => {
    renderComponent('abc', <TriggerValidation />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/mayor a 4 caracteres/i);
  });

  test('Should show an error when the remarks exceed the limit', async () => {
    renderComponent('x'.repeat(256), <TriggerValidation />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/menor a 255 caracteres/i);
  });
});
