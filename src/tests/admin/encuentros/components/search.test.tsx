import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from '@/app/admin/encuentros/(components)/search';

const { mockReplace, mockUseSearchParams } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ replace: mockReplace }),
}));

describe('Test on <Search /> component', () => {
  const renderComponent = (search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<Search placeholder="Buscar encuentro" />);

    const user = userEvent.setup();
    const input = () => screen.getByRole('textbox');
    const submit = () => screen.getByRole('button', { name: /buscar/i });
    const clear = () => screen.getByRole('button', { name: /limpiar búsqueda/i });

    return { user, input, submit, clear };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the input and buttons', () => {
    const { input, submit, clear } = renderComponent();

    expect(input()).toBeInTheDocument();
    expect(submit()).toBeInTheDocument();
    expect(clear()).toBeInTheDocument();
  });

  test('Should use the query param as the initial value', () => {
    const { input } = renderComponent('query=tigres');

    expect(input()).toHaveValue('tigres');
  });

  test('Should set the query and page params on submit', async () => {
    const { user, input, submit } = renderComponent();

    await user.type(input(), 'atlas');
    await user.click(submit());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin/encuentros?page=1&query=atlas');
    });
  });

  test('Should remove the query and page params when clearing', async () => {
    const { user, clear } = renderComponent('query=atlas&page=2');

    await user.click(clear());

    expect(mockReplace).toHaveBeenCalledWith('/admin/encuentros?');
  });
});
