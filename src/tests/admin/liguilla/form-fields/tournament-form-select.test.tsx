import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  useForm,
  FormProvider,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TournamentFormSelect } from '@/app/admin/liguilla/(components)/form-fields/tournament-select-field/tournament-form-select';
import { CreatePlayoffsSchema } from '@/shared/schemas';
import { tournamentsMock } from '../mocks/tournaments.mock';

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
  usePathname: () => '/admin/liguilla/crear',
  useRouter: () => ({ push: mockPush }),
}));

type FormValues = {
  tournament: string;
  category: string;
  teamsIds: string[];
  startingRound: string;
};

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsSchema) as any,
    defaultValues: {
      tournament: '',
      category: '',
      teamsIds: [],
      startingRound: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const tournament = useWatch({ name: 'tournament' });
  return <span data-testid="tournament-value">{tournament}</span>;
}

describe('Test on <TournamentFormSelect />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    tournaments = tournamentsMock,
    extra?: ReactNode,
  ) => {
    render(
      <TestWrapper>
        <TournamentFormSelect tournaments={tournaments} />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox');
    const getOption = (name: string) => screen.findByRole('option', { name });
    const getAllOptions = () => screen.getAllByRole('option');
    const findAllOptions = () => screen.findAllByRole('option');
    const findEmptyState = () => screen.findByText(/aún no hay torneos disponibles/i);

    return { user, combobox, getOption, getAllOptions, findAllOptions, findEmptyState };
  };

  test('Should render the label and placeholder', () => {
    const { combobox } = renderComponent();

    const label = screen.getByText('Torneo');

    expect(combobox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(screen.getByText(/seleccione torneo/i)).toBeInTheDocument();
  });

  test('Should render the tournament options', async () => {
    const { user, combobox, getOption, getAllOptions } = renderComponent();

    await user.click(combobox);

    const option = await getOption(tournamentsMock[0].name);
    const options = getAllOptions();

    expect(option).toBeInTheDocument();
    expect(options).toHaveLength(tournamentsMock.length);
  });

  test('Should deduplicate tournaments by name', async () => {
    const duplicated = [
      tournamentsMock[0],
      { ...tournamentsMock[0], id: '9f8e7d6c-5b4a-4392-8170-6e5d4c3b2a10' },
      tournamentsMock[1],
    ];

    const { user, combobox, findAllOptions } = renderComponent(duplicated);

    await user.click(combobox);

    const options = await findAllOptions();

    expect(options).toHaveLength(tournamentsMock.length);
  });

  test('Should render the empty state when there are no tournaments', async () => {
    const { user, combobox, findEmptyState } = renderComponent([]);

    await user.click(combobox);

    const emptyOption = await findEmptyState();

    expect(emptyOption).toBeInTheDocument();
  });

  test('Should set the tournament value and search param when selecting', async () => {
    const { user, combobox, getOption } = renderComponent(tournamentsMock, <FormValueDisplay />);

    await user.click(combobox);
    await user.click(await getOption(tournamentsMock[0].name));

    expect(screen.getByTestId('tournament-value')).toHaveTextContent(
      tournamentsMock[0].permalink,
    );
    expect(mockPush).toHaveBeenCalledWith(
      `/admin/liguilla/crear?tournament=${tournamentsMock[0].permalink}`,
    );
  });
});
