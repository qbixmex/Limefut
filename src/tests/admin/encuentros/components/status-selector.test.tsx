import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusSelector } from '@/app/admin/encuentros/(components)/status-selector';

const { mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ push: mockPush }),
}));

describe('Test on <StatusSelector />', () => {
  const renderComponent = (search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<StatusSelector />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', { name: /filtrar por estado/i });

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the status options', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: /programado/i })).toBeInTheDocument();
  });

  test('Should push the status param when a status is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    await user.click(await screen.findByRole('option', { name: /programado/i }));

    expect(mockPush).toHaveBeenCalledWith('/admin/encuentros?status=scheduled');
  });

  test('Should show the clear filter option when a status is set', async () => {
    const { user, combobox } = renderComponent('status=scheduled');

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: /borrar filtro/i })).toBeInTheDocument();
  });
});
