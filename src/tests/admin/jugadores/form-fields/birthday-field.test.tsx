import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BirthdayField } from '@/app/admin/jugadores/(components)/form-fields/birthday-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ birthday: Date | undefined }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { birthday: undefined },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetValidDate() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('birthday', new Date(2000, 5, 15), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <BirthdayField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText('Día')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Año')).toBeInTheDocument();
  });

  test('Should not show error when birthday is empty', () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show formatted date when birthday is valid', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    expect(await screen.findByText(/15 de junio del 2000/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
