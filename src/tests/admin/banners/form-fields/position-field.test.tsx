import { useEffect, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PositionField } from '@/app/admin/banners/(components)/form-fields/position-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children, position = 1 }: { children: ReactNode; position?: number }) {
  const form = useForm<{ position: number }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: { position },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function SetNonNumberValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('position', 'lorem', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function FormValueDisplay() {
  const position = useWatch({ name: 'position' });
  return <span data-testid="position-value">{position}</span>;
}

describe('Test on <PositionField />', () => {
  test('Should render correctly', () => {
    render(<PositionField />, { wrapper: TestWrapper });

    expect(screen.getByLabelText(/posición/i)).toBeInTheDocument();
  });

  test('Should show error when position type is invalid', async () => {
    render(
      <TestWrapper>
        <PositionField />
        <SetNonNumberValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/número válido/i);
    });
  });

  test('Should disable the decrement button when position is 1', () => {
    render(<PositionField />, { wrapper: TestWrapper });

    const [decrement] = screen.getAllByRole('button');

    expect(decrement).toBeDisabled();
  });

  test('Should increment the position when plus is clicked', async () => {
    render(<PositionField />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1];
    await user.click(incrementButton);

    expect(screen.getByTestId('position-value')).toHaveTextContent('2');
  });

  test('Should decrement the position when minus is clicked', async () => {
    render(
      <TestWrapper position={3}>
        <PositionField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const [decrement] = screen.getAllByRole('button');
    await user.click(decrement);

    expect(screen.getByTestId('position-value')).toHaveTextContent('2');
  });

  test('Should allow typing a position value', async () => {
    render(<PositionField />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const input = screen.getByLabelText(/posición/i);
    await user.clear(input);
    await user.type(input, '5');

    expect(screen.getByTestId('position-value')).toHaveTextContent('5');
  });
});
