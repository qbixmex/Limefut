import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CitiesField } from '@/app/admin/torneos/(components)/form-fields/cities-field';
import { createTournamentSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ cities: string[] }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetCitiesValue({ value }: { value: string[] | number[] }) {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('cities', value, { shouldValidate: true });
  }, [setValue, value]);
  return null;
}

describe('Test on <CitiesField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <CitiesField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when cities is empty', async () => {
    render(
      <TestWrapper>
        <CitiesField />
      </TestWrapper>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should not show error when cities are valid strings', async () => {
    render(
      <TestWrapper>
        <CitiesField />
        <SetCitiesValue value={['Guadalajara', 'Zapopan']} />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when cities contain non-string values', async () => {
    render(
      <TestWrapper>
        <CitiesField />
        <SetCitiesValue value={[123, 456, 789]} />
      </TestWrapper>,
    );

    await screen.findByText('123');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
