import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoriesFormSelect } from '@/app/admin/torneos/(components)/form-fields/categories-select-field/categories-form-select';
import { createTournamentSchema } from '@/shared/schemas';

const mockCategories = [
  { id: '5cc98217-ec35-455a-88a5-eff774500a9c', name: 'elementary-school' },
  { id: '598f9394-3c23-411a-a65a-33ba432826a0', name: 'junio-highschool' },
  { id: '3ac7a223-b0e1-472b-9010-8dc72bd5e0e1', name: 'high-school' },
];

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ categoriesIds: string[] }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
    defaultValues: { categoriesIds: [] },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetValidUUIDs() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('categoriesIds', [
      '5cc98217-ec35-455a-88a5-eff774500a9c',
      '598f9394-3c23-411a-a65a-33ba432826a0',
    ], { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetInvalidUUIDs() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('categoriesIds', ['not-a-uuid', 'also-not-a-uuid'], { shouldValidate: true });
  }, [setValue]);
  return null;
}

function FormErrorIndicator() {
  const { formState } = useFormContext();
  const categoriesErrors = formState.errors.categoriesIds as Record<string, { message?: string }> | undefined;
  const firstError = categoriesErrors?.[0];
  return <span data-testid="form-error">{firstError?.message ?? ''}</span>;
}

describe('Test on <CategoriesFormSelect />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText(/buscar categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/categorías \(0\)/i)).toBeInTheDocument();
  });

  test('Should not show error when categoriesIds is empty', async () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should not show error when categoriesIds are valid UUIDs', async () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
        <SetValidUUIDs />
      </TestWrapper>,
    );

    await screen.findByText(/categorías \(2\)/i);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when categoriesIds are not valid UUIDs', async () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
        <FormErrorIndicator />
        <SetInvalidUUIDs />
      </TestWrapper>,
    );

    await screen.findByText(/uuid válido/i);
    expect(screen.getByTestId('form-error')).toHaveTextContent(/uuid válido/i);
  });
});
