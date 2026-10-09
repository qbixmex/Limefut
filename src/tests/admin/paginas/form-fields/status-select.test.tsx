import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusSelect } from '@/app/admin/paginas/(components)/form-fields/status-select';
import { editPageSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ status: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { status: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const status = useWatch({ name: 'status' });
  return <span data-testid="status-value">{status}</span>;
}

function SetInvalidStatus() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('status', 'invalid-status' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <StatusSelect />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <StatusSelect />
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

    expect(combobox).toBeInTheDocument();
    expect(screen.getByText(/^estado/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccione una opción/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting an option', async () => {
    const { user, combobox, getOption } = renderComponent();

    await user.click(combobox);
    await user.click(await getOption('Publicado'));

    expect(screen.getByTestId('status-value')).toHaveTextContent('published');
  });

  test('Should show an error when an invalid value is set', async () => {
    renderComponent(<SetInvalidStatus />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/seleccione un estado/i);
  });
});
