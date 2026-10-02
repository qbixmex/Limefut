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
  const renderComponent = (position = 1, extra?: ReactNode) => {
    render(
      <TestWrapper position={position}>
        <PositionField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText(/posición/i);
    const [decrement, increment] = screen.getAllByRole('button');

    return { user, input, decrement, increment };
  };

  test('Should render correctly', () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  test('Should show error when position type is invalid', async () => {
    renderComponent(1, <SetNonNumberValue />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/número válido/i);
    });
  });

  test('Should disable the decrement button when position is 1', () => {
    const { decrement } = renderComponent();

    expect(decrement).toBeDisabled();
  });

  test('Should increment the position when plus is clicked', async () => {
    const { user, increment } = renderComponent();

    await user.click(increment);

    expect(screen.getByTestId('position-value')).toHaveTextContent('2');
  });

  test('Should decrement the position when minus is clicked', async () => {
    const { user, decrement } = renderComponent(3);

    await user.click(decrement);

    expect(screen.getByTestId('position-value')).toHaveTextContent('2');
  });

  test('Should allow typing a position value', async () => {
    const { user, input } = renderComponent();

    await user.clear(input);
    await user.type(input, '5');

    expect(screen.getByTestId('position-value')).toHaveTextContent('5');
  });
});
