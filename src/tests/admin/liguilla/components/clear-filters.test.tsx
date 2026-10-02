import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ClearFilters } from '@/app/admin/liguilla/(components)/clear-filters';

const { mockReplace, mockRefresh } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockRefresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, refresh: mockRefresh }),
  usePathname: () => '/admin/liguilla',
}));

const renderComponent = () => {
  return render(<ClearFilters />, { wrapper: TooltipProvider });
};

describe('Test on <ClearFilters /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the button', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /borrar filtros/i });
    const filterIcon = button.querySelector('svg');

    expect(button).toBeInTheDocument();
    expect(filterIcon).toBeInTheDocument();
  });

  test('Should replace the pathname and refresh on click', async () => {
    renderComponent();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /borrar filtros/i }));

    expect(mockReplace).toHaveBeenCalledWith('/admin/liguilla');
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('Should show tooltip on mouse over', async () => {
    renderComponent();

    const user = userEvent.setup();
    await user.hover(screen.getByRole('button', { name: /borrar filtros/i }));

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/borrar filtros/i);
  });
});
