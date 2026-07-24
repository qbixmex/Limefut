import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { CreatePlayer } from '@/app/admin/jugadores/(components)/create-player';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('Test on <CreatePlayer /> component', () => {
  const testParams = 'tournament=tournament-test&category=category-test';

  test('Should render null when tournament and category are not present', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>,
    );

    const { container } = render(<CreatePlayer />, { wrapper: TooltipProvider });

    expect(container).toBeEmptyDOMElement();
  });

  test('Should render correctly when tournament and category are present', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<CreatePlayer />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de crear/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<CreatePlayer />, { wrapper: TooltipProvider });

    const button = screen.getByRole('button', { name: /crear jugador/i });
    const user = userEvent.setup();
    await user.hover(button);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear jugador/i);
  });

  test('Should navigate to create player page on click', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(testParams) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<CreatePlayer />, { wrapper: TooltipProvider });

    const button = screen.getByRole('button', { name: /crear jugador/i });
    const user = userEvent.setup();
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/admin/jugadores/crear'),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('tournament=tournament-test'),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('category=category-test'),
    );
  });
});
