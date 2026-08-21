import { render, screen } from '@testing-library/react';
import { MatchesTable } from '@/app/admin/encuentros/(components)/matches-table';
import { matchesMock } from '../mocks/matches.mock';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';

vi.mock('@/app/admin/encuentros/(components)/weeks-selector', () => ({
  WeeksSelector: () => <span data-testid="weeks-selector" />,
}));

vi.mock('@/app/admin/encuentros/(components)/date-selector', () => ({
  DateSelector: () => <span data-testid="date-selector" />,
}));

vi.mock('@/app/admin/encuentros/(components)/status-selector', () => ({
  StatusSelector: () => <span data-testid="status-selector" />,
}));

vi.mock('@/app/admin/encuentros/(actions)/update-match-input-score.action');

vi.mock('@/app/admin/encuentros/(components)/match-status', () => ({
  MatchStatus: () => <span data-testid="match-status" />,
}));

vi.mock('@/app/admin/encuentros/(components)/finish-match', () => ({
  FinishMatch: () => <span data-testid="finish-match" />,
}));

vi.mock('@/app/admin/encuentros/(components)/match-details', () => ({
  MatchDetails: () => <span data-testid="match-details" />,
}));

vi.mock('@/app/admin/encuentros/(components)/edit-match', () => ({
  EditMatch: () => <span data-testid="edit-match" />,
}));

vi.mock('@/app/admin/encuentros/(components)/delete-match', () => ({
  DeleteMatch: () => <span data-testid="delete-match" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on <MatchesTable /> component', () => {
  const defaultProps = {
    matches: matchesMock,
    matchesWeeks: [7, 9],
    pagination: {
      currentPage: 1,
      totalPages: 2,
    },
  };

  const renderComponent = (props = defaultProps) => {
    render(<MatchesTable {...props} />);
  };

  test('Should render the table', () => {
    renderComponent();

    const table = screen.getByRole('table', { name: /tabla/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render header selectors', () => {
    renderComponent();

    expect(screen.getByTestId('weeks-selector')).toBeInTheDocument();
    expect(screen.getAllByTestId('date-selector')).toHaveLength(2);
    expect(screen.getByTestId('status-selector')).toBeInTheDocument();
  });

  test('Should render empty state when no matches', () => {
    renderComponent({ ...defaultProps, matches: [] });

    const message = screen.getByText(/no hay encuentros programados/i);

    expect(message).toBeInTheDocument();
  });

  test('Should render team names', () => {
    renderComponent();

    const localTeams = screen.getAllByLabelText(/equipo local/i);
    const visitorTeams = screen.getAllByLabelText(/equipo visitante/i);

    localTeams.forEach((element, index) => {
      expect(element).toHaveTextContent(matchesMock[index].localTeam.name);
    });

    visitorTeams.forEach((element, index) => {
      expect(element).toHaveTextContent(matchesMock[index].visitorTeam.name);
    });
  });

  test('Should render links to teams', () => {
    renderComponent();

    matchesMock.forEach((match) => {
      const localTeamLink = screen.getByTitle(`Ver detalles del equipo local ${match.localTeam.name}`);
      const visitorTeamLink = screen.getByTitle(`Ver detalles del equipo visitante ${match.visitorTeam.name}`);

      expect(localTeamLink).toHaveAttribute(
        'href',
        ROUTES.ADMIN_TEAMS_SHOW(match.localTeam.id),
      );
      expect(visitorTeamLink).toHaveAttribute(
        'href',
        ROUTES.ADMIN_TEAMS_SHOW(match.visitorTeam.id),
      );
    });
  });

  test('Should render field link or fallback badge', () => {
    renderComponent();

    const matchesWithField = matchesMock.filter((match) => match.field);

    matchesWithField.forEach((match) => {
      const fieldLink = screen.getByTitle(`Ver detalles de la cancha ${match.field?.name}`);

      expect(fieldLink).toHaveAttribute(
        'href',
        ROUTES.ADMIN_FIELDS_SHOW(match.field?.id as string),
      );
    });
  });

  test('Should render fallback badge when there is no field assigned', () => {
    renderComponent();

    const fieldStatus = screen.getByTestId(matchesMock[2].id);
    expect(fieldStatus).toHaveTextContent(/no disponible/i);
  });

  test('Should render week number', () => {
    renderComponent();

    const weeksElements = screen.getAllByRole('status', {
      name: /jornada/i,
    });

    for (const index in matchesMock) {
      if (!matchesMock[index].week) continue;
      expect(weeksElements[index]).toHaveTextContent(`${matchesMock[index].week}`);
    }
  });

  test('Should render week "no definida" if week is not assigned', () => {
    renderComponent();

    const weeks = screen.getAllByRole('status', {
      name: /jornada/i,
    });

    for (const index in matchesMock) {
      if (matchesMock[index].week) continue;
      expect(weeks[index]).toHaveTextContent(/no definida/i);
    }
  });

  test('Should render formatted match date', () => {
    renderComponent();

    const dateElements = screen.getAllByRole('status', {
      name: /fecha/i,
    });

    expect(dateElements).toHaveLength(matchesMock.length);

    for (const index in matchesMock) {
      if (!matchesMock[index].matchDate) continue;
      const expectedDate = format(matchesMock[index].matchDate, 'EEE dd MMM, y', { locale: es }).toUpperCase();
      expect(dateElements[index]).toHaveTextContent(expectedDate);
    }
  });

  test('Should render fallback badge when match date is not assigned', () => {
    renderComponent();

    const dateElements = screen.getAllByRole('status', {
      name: /fecha/i,
    });

    for (const index in matchesMock) {
      if (matchesMock[index].matchDate) continue;

      expect(dateElements[index]).toHaveTextContent(/no asignada/i);
    }
  });

  test('Should render score inputs where match status is not completed', () => {
    renderComponent();

    const localScores = screen.getAllByRole('spinbutton', {
      name: /marcador local/i,
    });
    const visitorScores = screen.getAllByRole('spinbutton', {
      name: /marcador visitante/i,
    });
    const notCompletedMatches = matchesMock.filter((match) => {
      return match.status !== MATCH_STATUS.COMPLETED;
    });

    expect(localScores).toHaveLength(notCompletedMatches.length);
    expect(visitorScores).toHaveLength(notCompletedMatches.length);

    localScores.forEach((input, index) => {
      expect(input).toHaveValue(notCompletedMatches[index].localScore);
    });
    visitorScores.forEach((input, index) => {
      expect(input).toHaveValue(notCompletedMatches[index].visitorScore);
    });
  });

  test('Should render score badges where match status is completed', () => {
    renderComponent();

    const localScores = screen.getAllByRole('status', {
      name: 'Marcador local',
    });
    const visitorScores = screen.getAllByRole('status', {
      name: 'Marcador visitante',
    });

    const completedMatches = matchesMock.filter((match) => {
      return match.status === MATCH_STATUS.COMPLETED;
    });

    expect(localScores).toHaveLength(completedMatches.length);
    expect(visitorScores).toHaveLength(completedMatches.length);

    localScores.forEach((input, index) => {
      expect(input).toHaveTextContent(
        completedMatches[index].localScore.toString()
      );
    });
    visitorScores.forEach((input, index) => {
      expect(input).toHaveTextContent(
        completedMatches[index].visitorScore.toString()
      );
    });
  });

  test('Should render penalty shootout badges', () => {
    renderComponent();

    const localPenalties = screen.getAllByRole('status', {
      name: 'Penales local',
    });
    const visitorPenalties = screen.getAllByRole('status', {
      name: 'Penales visitante',
    });

    const matchesWithPenalties = matchesMock.filter((match) => {
      return match.penaltyShootout?.status === MATCH_STATUS.COMPLETED;
    });

    expect(localPenalties).toHaveLength(matchesWithPenalties.length);
    expect(visitorPenalties).toHaveLength(matchesWithPenalties.length);

    localPenalties.forEach((badge, index) => {
      expect(badge).toHaveTextContent(
        matchesWithPenalties[index].penaltyShootout!.localGoals.toString(),
      );
    });
    visitorPenalties.forEach((badge, index) => {
      expect(badge).toHaveTextContent(
        matchesWithPenalties[index].penaltyShootout!.visitorGoals.toString(),
      );
    });
  });

  test('Should render status column according to match state', () => {
    renderComponent();

    const matchStates = screen.getAllByRole('status', {
      name: 'Estado del encuentro',
    });
    const completedMatches = matchesMock.filter((match) => {
      return match.status === MATCH_STATUS.COMPLETED;
    });
    const notCompletedMatches = matchesMock.filter((match) => {
      return match.status !== MATCH_STATUS.COMPLETED;
    });

    expect(matchStates).toHaveLength(completedMatches.length);

    matchStates.forEach((state) => {
      expect(state).toHaveTextContent(/finalizado/i);
    });

    expect(screen.getAllByTestId('match-status')).toHaveLength(notCompletedMatches.length);
    expect(screen.getAllByTestId('finish-match')).toHaveLength(notCompletedMatches.length);
  });

  test('Should render action buttons per row', () => {
    renderComponent();

    expect(screen.getAllByTestId('match-details')).toHaveLength(matchesMock.length);
    expect(screen.getAllByTestId('edit-match')).toHaveLength(matchesMock.length);
    expect(screen.getAllByTestId('delete-match')).toHaveLength(matchesMock.length);
  });

  test('Should render pagination when there are matches and multiple pages', () => {
    renderComponent();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).not.toHaveClass('hidden');
  });

  test('Should hide pagination when no matches', () => {
    renderComponent({ ...defaultProps, matches: [] });

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).toHaveClass('hidden');
  });
});
