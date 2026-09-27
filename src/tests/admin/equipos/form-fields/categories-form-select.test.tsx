import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoriesFormSelect } from '@/app/admin/equipos/(components)/form-fields/category-select-field/categories-form-select';
import { createTeamSchema } from '@/shared/schemas';

const mockCategories = [
  { id: '5cc98217-ec35-455a-88a5-eff774500a9c', name: 'varonil' },
  { id: '598f9394-3c23-411a-a65a-33ba432826a0', name: 'femenil' },
  { id: '3ac7a223-b0e1-472b-9010-8dc72bd5e0e1', name: 'infantil' },
];

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ categoryId: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTeamSchema) as any,
    defaultValues: { categoryId: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetValidUUID() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('categoryId', '5cc98217-ec35-455a-88a5-eff774500a9c', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetInvalidUUID() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('categoryId', 'not-a-uuid', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function FormErrorIndicator() {
  const { formState } = useFormContext();
  const error = formState.errors.categoryId;
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message) : '';
  return <span data-testid="form-error">{message}</span>;
}

describe('Test on <CategoriesFormSelect />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText(/buscar categoría/i)).toBeInTheDocument();
  });

  test('Should not show error when no category is selected', () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should not show error when categoryId is a valid UUID', async () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
        <SetValidUUID />
      </TestWrapper>,
    );

    await screen.findByDisplayValue('varonil');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when categoryId is not a valid UUID', async () => {
    render(
      <TestWrapper>
        <CategoriesFormSelect categories={mockCategories} />
        <FormErrorIndicator />
        <SetInvalidUUID />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('form-error')).toHaveTextContent(/uuid válido/i),
    );
  });
});
