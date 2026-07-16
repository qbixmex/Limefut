import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DescriptionTextArea } from '@/app/admin/torneos/(components)/form-fields/description-textarea';
import { createTournamentSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ description: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
    defaultValues: { description: '' },
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
    setValue('description', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <DescriptionTextArea />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when description is empty string', async () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid input/i);
  });

  test('Should show error when description is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when description has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'Descripción válida');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when description exceeds 500 characters', async () => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'x'.repeat(501));

    expect(screen.getByRole('alert')).toHaveTextContent(/no debe ser mayor a 500 caracteres/i);
  });
});
