import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ClearFilters } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/clear-filters';

const { mockReplace, mockRefresh } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockRefresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, refresh: mockRefresh }),
  usePathname: () => '/admin/liguilla/playoff-id/encuentros',
}));

describe('Test on <ClearFilters /> component', () => {
  const renderComponent = () => {
    render(<ClearFilters />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const button = () => screen.getByRole('button', { name: /borrar filtros/i });

    return { user, button };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the button with its icon', () => {
    const { button } = renderComponent();

    expect(button()).toBeInTheDocument();
    expect(button().querySelector('svg')).toBeInTheDocument();
  });

  test('Should replace the pathname and refresh on click', async () => {
    const { user, button } = renderComponent();

    await user.click(button());

    expect(mockReplace).toHaveBeenCalledWith('/admin/liguilla/playoff-id/encuentros');
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, button } = renderComponent();

    await user.hover(button());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/borrar filtros/i);
  });
});
