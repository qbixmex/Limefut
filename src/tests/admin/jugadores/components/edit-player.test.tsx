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
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<EditPlayer playerId={playerId} />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de lápiz/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<EditPlayer playerId={playerId} />, { wrapper: TooltipProvider });

    const img = screen.getByRole('img', { name: /icono de lápiz/i });
    const user = userEvent.setup();
    await user.hover(img);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should navigate to edit player page on click', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<EditPlayer playerId={playerId} />, { wrapper: TooltipProvider });

    const img = screen.getByRole('img', { name: /icono de lápiz/i });
    const user = userEvent.setup();
    await user.click(img);

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
