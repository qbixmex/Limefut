import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { TournamentSelectField } from '@/app/admin/encuentros/(components)/form-fields/tournament-select-field';
import { type Tournament, tournamentsMock, TORNEO_VERANO } from '../mocks/tournaments.mock';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
  usePathname: () => ROUTES.ADMIN_MATCHES_CREATE,
  useRouter: () => ({ replace: mockReplace }),
}));

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    defaultValues: {
      tournament: '',
      category: 'secundaria-varonil',
    },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const tournament = useWatch({ name: 'tournament' });
  const category = useWatch({ name: 'category' });
  return (
    <>
      <span data-testid="tournament-value">{tournament}</span>
      <span data-testid="category-value">{category}</span>
    </>
  );
}

describe('Test on <TournamentSelectField />', () => {
  const renderComponent = (
    tournaments: Tournament[],
    extraComponent?: ReactNode,
  ) => {
    render(
      <TestWrapper>
        <TournamentSelectField tournaments={tournaments} />
        {extraComponent}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const label = () => screen.getByText('Torneo');
    const combobox = () => screen.getByRole('combobox');
    const options = () => screen.getAllByRole('option');

    return {
      user,
      label,
      combobox,
      options,
    };
  };

  test('Should render the label and options', async () => {
    const { user, label, combobox, options } = renderComponent(tournamentsMock);

    expect(label()).toBeInTheDocument();

    await user.click(combobox());

    expect(options()).toHaveLength(tournamentsMock.length);
  });

  test('Should update the tournament, clear the category and sync the URL', async () => {
    const { user, combobox, options } = renderComponent(
      tournamentsMock,
      <FormValueDisplay />,
    );

    await user.click(combobox());
    const lastOption = options().at(-1) as HTMLOptionElement;
    await user.click(lastOption);

    await waitFor(() => {
      const tournamentValue = screen.getByTestId('tournament-value');
      expect(tournamentValue).toHaveTextContent(TORNEO_VERANO.permalink);
    });

    expect(screen.getByTestId('category-value')).toHaveTextContent('');
    expect(mockReplace).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES_CREATE +
      '?tournament=' +
      TORNEO_VERANO.permalink,
    );
  });

  test('Should show a disabled option when there are no tournaments', async () => {
    const { user, combobox } = renderComponent([]);

    await user.click(combobox());

    const option = await screen.findByRole('option', {
      name: /no hay torneos disponibles/i,
    });
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });
});
