import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { CategorySelectField } from '@/app/admin/encuentros/(components)/form-fields/category-select-field';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
  usePathname: () => '/admin/encuentros/crear',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

type FormValues = { tournament?: string; category?: string };

type Category = {
  id: string;
  name: string;
  permalink: string;
};

function TestWrapper({
  children,
  tournament,
}: Readonly<{ children: ReactNode; tournament?: string }>) {
  const form = useForm<FormValues>({ defaultValues: { tournament } });

  return <FormProvider {...form}>{children}</FormProvider>;
}

const categories: Category[] = [
  { id: '1', name: 'Sub-15', permalink: 'sub-15' },
];

describe('Test on <CategorySelectField />', () => {
  const renderComponent = (fieldCategories: Category[], tournament?: string) => {
    render(
      <TestWrapper tournament={tournament}>
        <CategorySelectField categories={fieldCategories} />
      </TestWrapper>,
    );

    return { combobox: screen.getByRole('combobox') };
  };

  test('Should be disabled when there is no tournament and no categories', () => {
    const { combobox } = renderComponent([]);

    expect(combobox).toBeDisabled();
    expect(combobox).toHaveTextContent(/seleccione un torneo primero/i);
  });

  test('Should be enabled when categories are provided even if the form tournament is empty', () => {
    const { combobox } = renderComponent(categories);

    expect(combobox).toBeEnabled();
    expect(combobox).toHaveTextContent(/seleccione una categoría/i);
  });

  test('Should be enabled when the form has a tournament', () => {
    const { combobox } = renderComponent([], 'liga');

    expect(combobox).toBeEnabled();
    expect(combobox).toHaveTextContent(/seleccione una categoría/i);
  });
});
