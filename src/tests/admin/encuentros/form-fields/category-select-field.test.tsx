import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { CategorySelectField } from '@/app/admin/encuentros/(components)/form-fields/category-select-field';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => ROUTES.ADMIN_MATCHES_CREATE,
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
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
  category,
}: Readonly<{ children: ReactNode; tournament?: string; category?: string }>) {
  const form = useForm<FormValues>({ defaultValues: { tournament, category } });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const category = useWatch({ name: 'category' });
  return <span data-testid="category-value">{category}</span>;
}

const categories: Category[] = [
  {
    id: '90c2f031-81e2-416a-91cf-4cb50f4153de',
    name: 'Primaria Varonil',
    permalink: 'primaria-varonil',
  },
  {
    id: '2ea5defe-a239-43ad-8bd1-0b76526ddbf1',
    name: 'Primaria Femenil',
    permalink: 'primaria-femenil',
  },
  {
    id: '0cf7028c-1c43-4515-8f38-f5b604876335',
    name: 'Secundaria Femenil',
    permalink: 'secundaria-femenil',
  },
  {
    id: '1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
    name: 'Secundaria Varonil',
    permalink: 'secundaria-varonil',
  },
];

describe('Test on <CategorySelectField />', () => {
  const renderComponent = (
    fieldCategories: Category[],
    options: { tournament?: string; category?: string; search?: string } = {},
  ) => {
    const { tournament, category, search = '' } = options;
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(
      <TestWrapper tournament={tournament} category={category}>
        <CategorySelectField categories={fieldCategories} />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    // The trigger button has role="combobox", but once the popover is open the
    // CommandInput also exposes role="combobox". The trigger is always first.
    const combobox = () => screen.getAllByRole('combobox')[0];
    const searchInput = () => screen.queryByPlaceholderText('Buscar categoría');
    const selectOption = async (name: string) => {
      await user.click(combobox());
      await user.click(await screen.findByRole('option', { name }));
    };

    return { user, combobox, searchInput, selectOption };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
  });

  test('Should be disabled when there is no tournament and no categories', () => {
    const { combobox } = renderComponent([]);

    expect(combobox()).toBeDisabled();
    expect(combobox()).toHaveTextContent(/seleccione un torneo primero/i);
  });

  test('Should be enabled when categories are provided even if the form tournament is empty', () => {
    const { combobox } = renderComponent(categories);

    expect(combobox()).toBeEnabled();
    expect(combobox()).toHaveTextContent(/seleccione una categoría/i);
  });

  test('Should be enabled when the form has a tournament', () => {
    const { combobox } = renderComponent([], { tournament: 'liga' });

    expect(combobox()).toBeEnabled();
    expect(combobox()).toHaveTextContent(/seleccione una categoría/i);
  });

  test('Should open the popover with the search input and the options', async () => {
    const { user, combobox } = renderComponent(categories, { tournament: 'liga' });

    await user.click(combobox());

    await waitFor(() => {
      const placeHolder = screen.getByPlaceholderText('Buscar categoría');
      expect(placeHolder).toBeInTheDocument();

      const options = screen.getAllByRole('option');

      options.forEach((option, index) => {
        expect(option).toHaveTextContent(categories[index].name);
      });
    });
  });

  test('Should select an available category', async () => {
    const { combobox, selectOption } = renderComponent(categories, { tournament: 'liga' });

    await selectOption(categories[1].name);

    await waitFor(() => {
      expect(screen.getByTestId('category-value')).toHaveTextContent(categories[1].permalink);
    });
    expect(combobox()).toHaveTextContent(categories[1].name);
    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES_CREATE}?category=${categories[1].permalink}`,
    );
  });

  test('Should change a category if selected category', async () => {
    const { combobox, selectOption } = renderComponent(categories, {
      tournament: 'liga',
      category: categories[0].permalink,
    });

    // Starts with the first category selected
    expect(combobox()).toHaveTextContent(categories[0].name);

    await selectOption(categories[1].name);

    await waitFor(() => {
      expect(screen.getByTestId('category-value')).toHaveTextContent(categories[1].permalink);
    });
    expect(combobox()).toHaveTextContent(categories[1].name);
    expect(combobox()).not.toHaveTextContent(categories[0].name);
    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES_CREATE}?category=${categories[1].permalink}`,
    );
  });

  test('Should render the category that matches the form value', () => {
    const { combobox } = renderComponent(categories, {
      tournament: 'liga',
      category: categories[0].permalink,
    });

    expect(combobox()).toHaveTextContent(categories[0].name);
  });

  test('Should render the placeholder when the form value does not match any category', () => {
    const { combobox } = renderComponent(categories, {
      tournament: 'liga',
      category: 'unknown-permalink',
    });

    expect(combobox()).toHaveTextContent(/seleccione una categoría/i);
  });

  test('Should mark the selected category with a visible check', async () => {
    const { user, combobox } = renderComponent(categories, {
      tournament: 'liga',
      category: categories[0].permalink,
    });

    await user.click(combobox());

    const selectedOption = await screen.findByRole('option', { name: categories[0].name });
    const otherOption = screen.getByRole('option', { name: categories[1].name });

    expect(selectedOption.querySelector('svg')).toHaveClass('opacity-100');
    expect(otherOption.querySelector('svg')).toHaveClass('opacity-0');
  });

  test('Should close the popover after selecting a category', async () => {
    const { combobox, searchInput, selectOption } = renderComponent(categories, {
      tournament: 'liga',
    });

    await selectOption(categories[0].name);

    expect(searchInput()).not.toBeInTheDocument();
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });

  test('Should toggle aria-expanded when opening the popover', async () => {
    const { user, combobox } = renderComponent(categories, { tournament: 'liga' });

    expect(combobox()).toHaveAttribute('aria-expanded', 'false');

    await user.click(combobox());

    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
  });

  test('Should not open the popover when it is disabled', async () => {
    const { user, combobox, searchInput } = renderComponent([]);

    await user.click(combobox());

    expect(searchInput()).not.toBeInTheDocument();
  });

  test('Should show the empty message when there are no categories', async () => {
    const { user, combobox } = renderComponent([], { tournament: 'liga' });

    await user.click(combobox());

    expect(
      await screen.findByText(/aún no hay categorías disponibles/i),
    ).toBeInTheDocument();
  });

  test('Should show the "not found" message when the search has no match', async () => {
    const { user, combobox, searchInput } = renderComponent(categories, {
      tournament: 'liga',
    });

    await user.click(combobox());
    await user.type(await screen.findByPlaceholderText('Buscar categoría'), 'zzz');

    expect(searchInput()).toBeInTheDocument();
    expect(await screen.findByText(/no se encontró la categoría/i)).toBeInTheDocument();
  });

  test('Should filter the options by the search term', async () => {
    const { user, combobox } = renderComponent(categories, { tournament: 'liga' });

    await user.click(combobox());
    await user.type(await screen.findByPlaceholderText('Buscar categoría'), 'Femenil');

    expect(
      await screen.findByRole('option', { name: categories[1].name }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: categories[0].name }),
    ).not.toBeInTheDocument();
  });

  test('Should preserve the existing search params when selecting a category', async () => {
    const { selectOption } = renderComponent(categories, {
      tournament: 'liga',
      search: 'tournament=liga',
    });

    await selectOption(categories[0].name);

    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES_CREATE}?tournament=liga&category=${categories[0].permalink}`,
    );
  });
});
