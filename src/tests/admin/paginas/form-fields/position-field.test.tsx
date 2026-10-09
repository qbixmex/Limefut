import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PositionField } from '@/app/admin/paginas/(components)/form-fields/position-field';
import { editPageSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ position: number }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { position: 0 },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const position = useWatch({ name: 'position' });
  return <span data-testid="position-value">{String(position)}</span>;
}

function SetInvalidPosition() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('position', 'not-a-number' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PositionField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <PositionField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const spinbutton = screen.getByRole('spinbutton', { name: /posición/i });

    return { user, spinbutton };
  };

  test('Should render correctly', () => {
    const { spinbutton } = renderComponent();

    expect(spinbutton).toBeInTheDocument();
    expect(spinbutton).toHaveValue(0);
  });

  test('Should update the form value when typing a number', async () => {
    const { user, spinbutton } = renderComponent();

    await user.clear(spinbutton);
    await user.type(spinbutton, '5');

    expect(screen.getByTestId('position-value')).toHaveTextContent('5');
  });

  test('Should show an error when the value is not a number', async () => {
    renderComponent(<SetInvalidPosition />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/posición debe ser un número válido/i);
  });
});
