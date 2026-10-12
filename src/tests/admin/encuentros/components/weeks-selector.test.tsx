import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeeksSelector } from '@/app/admin/encuentros/(components)/weeks-selector';

const { mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ push: mockPush }),
}));

describe('Test on <WeeksSelector />', () => {
  const renderComponent = (weeks = [1, 2], search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<WeeksSelector weeks={weeks} />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', { name: /filtrar por jornada/i });

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the week options', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    const option = await screen.findByRole('option', { name: /jornada 2/i });

    expect(option).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /ascendente/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /sin asignar/i })).toBeInTheDocument();
  });

  test('Should push the sort-week param when a week is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /jornada 2/i });
    await user.click(option);

    expect(mockPush).toHaveBeenCalledWith('/admin/encuentros?sort-week=2');
  });

  test('Should show the clear filter option when a week sort is set', async () => {
    const { user, combobox } = renderComponent([1, 2], 'sort-week=asc');

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: /borrar filtro/i })).toBeInTheDocument();
  });
});
