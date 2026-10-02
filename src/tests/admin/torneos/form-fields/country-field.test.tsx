import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CountryField } from '@/app/admin/torneos/(components)/form-fields/country-field';
import { createTournamentSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ country: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
    defaultValues: { country: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('country', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <CountryField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <CountryField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
  });

  test('Should not show error when country is empty string', async () => {
    const { textbox } = renderComponent();

    expect(textbox).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid input/i);
  });

  test('Should show error when country is less than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when country has 3 or more valid characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'México');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when country exceeds 100 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(101));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });
});
