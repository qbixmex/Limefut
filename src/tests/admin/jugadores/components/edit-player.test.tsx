import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { EditPlayer } from '@/app/admin/jugadores/(components)/edit-player';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const playerId = '550e8400-e29b-41d4-a716-446655440001';
const testParams = 'tournament=tournament-test&category=category-test';

describe('Test on <EditPlayer /> component', () => {
  const renderComponent = () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<EditPlayer playerId={playerId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /editar jugador/i });

    return { user, button };
  };

  test('Should render null when tournament and category are not present', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>,
    );

    const { container } = render(<EditPlayer playerId={playerId} />, {
      wrapper: TooltipProvider,
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('Should render correctly when tournament and category are present', () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, button } = renderComponent();

    await user.hover(button);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/editar/i);
  });

  test('Should navigate to edit player page on click', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);

    const { user, button } = renderComponent();

    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`/admin/jugadores/editar/${playerId}`),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('tournament=tournament-test'),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('category=category-test'),
    );
  });
});
