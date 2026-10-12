import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateSelector } from '@/app/admin/encuentros/(components)/date-selector';

const { mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ push: mockPush }),
}));

describe('Test on <DateSelector />', () => {
  const renderComponent = (label: 'date' | 'hour' = 'date', search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<DateSelector label={label} />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox');

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the date placeholder', () => {
    renderComponent('date');

    expect(screen.getByText('Fecha')).toBeInTheDocument();
  });

  test('Should render the hour placeholder', () => {
    renderComponent('hour');

    expect(screen.getByText('Hora')).toBeInTheDocument();
  });

  test('Should push the sort-match-date param when an order is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /ascendente/i });
    await user.click(option);

    expect(mockPush).toHaveBeenCalledWith(
      '/admin/encuentros?sort-match-date=asc',
    );
  });

  test('Should show the clear filter option when a date sort is set', async () => {
    const { user, combobox } = renderComponent('date', 'sort-match-date=desc');

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: /borrar filtro/i })).toBeInTheDocument();
  });
});
