import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CreateMatch } from '@/app/admin/encuentros/(components)/create-match';
import { ROUTES } from '@/shared/constants/routes';

const { mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
}));

describe('Test on <CreateMatch /> component', () => {
  const renderComponent = (search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<CreateMatch />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /crear encuentro/i });

    return { user, link };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/crear/i);
  });

  test('Should link to the create route without params when nothing is selected', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', ROUTES.ADMIN_MATCHES_CREATE);
  });

  test('Should carry the tournament and category params in the link', () => {
    const { link } = renderComponent('tournament=liga&category=sub-15');

    expect(link).toHaveAttribute(
      'href',
      `${ROUTES.ADMIN_MATCHES_CREATE}?tournament=liga&category=sub-15`,
    );
  });

  test('Should carry only the tournament when there is no category selected', () => {
    const { link } = renderComponent('tournament=liga');

    expect(link).toHaveAttribute(
      'href',
      `${ROUTES.ADMIN_MATCHES_CREATE}?tournament=liga`,
    );
  });
});
