import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DescriptionTextArea } from '@/app/admin/entrenadores/(components)/form-fields/description-text-area';
import { createCoachSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ description: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCoachSchema) as any,
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

function SetShortDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'abc', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'Descripción válida', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <DescriptionTextArea />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
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

  test('Should not show error when description is untouched', () => {
    renderComponent();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid input/i);
  });

  test('Should show error when description is less than 8 characters', async () => {
    renderComponent(<SetShortDescription />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when description is valid', async () => {
    renderComponent(<SetValidDescription />);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('Should show error when description exceeds 250 characters', async () => {
    renderComponent(<SetLongDescription />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });

  test('Should allow typing a valid description', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'Descripción válida');

    expect(screen.getByRole('textbox')).toHaveValue('Descripción válida');
  });
});
