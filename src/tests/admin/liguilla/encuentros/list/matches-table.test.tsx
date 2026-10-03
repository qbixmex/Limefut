import { render, screen } from '@testing-library/react';
import { MatchesTable } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/matches-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { MATCH_STATUS, PLAYOFF_ROUND } from '@/shared/enums';
import { ROUTES } from '@/shared/constants/routes';
import { playoffId } from '../mocks/playoff.mock';
import { playoffMatchesMock } from '../mocks/playoff-matches.mock';

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match-input-score.action');

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/match-status', () => ({
  MatchStatus: () => <span data-testid="match-status" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/finish-match', () => ({
  FinishMatch: () => <span data-testid="finish-match" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/show-info', () => ({
  ShowInfo: () => <span data-testid="show-info" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/edit-match', () => ({
  EditMatch: () => <span data-testid="edit-match" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/delete-match', () => ({
  DeleteMatch: () => <span data-testid="delete-match" />,
}));

describe('Tests on <MatchesTable /> component', () => {
  const renderComponent = (matches = playoffMatchesMock) => {
    return render(<MatchesTable playoffId={playoffId} matches={matches} />);
  };

  test('Should render the table', () => {
    renderComponent();

    const table = screen.getByRole('table', { name: /encuentros de liguilla/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render the empty state when there are no matches', () => {
    renderComponent([]);

    const emptyMessage = screen.getByText(/no hay encuentros disponibles/i);

    const localTeams = screen.queryAllByLabelText(/equipo local/i);
    const visitorTeams = screen.queryAllByLabelText(/equipo visitante/i);

    expect(emptyMessage).toBeInTheDocument();
    expect(localTeams).toHaveLength(0);
    expect(visitorTeams).toHaveLength(0);
  });

  test('Should render the team links', () => {
    renderComponent();

    playoffMatchesMock.forEach((match) => {
      const local = screen.getByTitle(`Ver detalles del equipo local ${match.local.name}`);
      const visitor = screen.getByTitle(`Ver detalles del equipo visitante ${match.visitor.name}`);

      expect(local).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(match.local.id));
      expect(visitor).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(match.visitor.id));
    });
  });

  test('Should render the category badges', () => {
    renderComponent();

    const gender = screen.getAllByText(/secundaria varonil/i);

    expect(gender).toHaveLength(2);
  });

  test('Should render the group badges', () => {
    renderComponent();

    expect(screen.getAllByText('gold')).toHaveLength(2);
    expect(screen.getAllByText('silver')).toHaveLength(1);
  });

  test('Should render the round badges', () => {
    renderComponent();

    expect(screen.getByText('quarterfinal')).toBeInTheDocument();
    expect(screen.getByText('semifinal')).toBeInTheDocument();
    expect(screen.getByText('final')).toBeInTheDocument();
  });

  test('Should render the field link when the match has a field', () => {
    renderComponent();

    const matchesWithField = playoffMatchesMock.filter((match) => match.field);

    matchesWithField.forEach((match) => {
      const link = screen.getByTitle(`Ver detalles de la cancha ${match.field!.name}`);

      expect(link).toHaveAttribute('href', ROUTES.ADMIN_FIELDS_SHOW(match.field!.id));
    });
  });

  test('Should render the field fallback when the match has no field', () => {
    renderComponent();

    const noFieldMatch = playoffMatchesMock.find((match) => !match.field)!;

    expect(screen.getByTestId(noFieldMatch.id)).toHaveTextContent(/no disponible/i);
  });

  test('Should render the formatted date', () => {
    renderComponent();

    const dates = screen.getAllByRole('status', { name: 'Fecha del encuentro' });

    expect(dates).toHaveLength(playoffMatchesMock.length);

    for (let index = 0; index < (playoffMatchesMock.length - 1); index++) {
      const matchDate = playoffMatchesMock[index].matchDate;
      if (matchDate) {
        const expectedDate = format(matchDate, 'EEE dd MMM, y', { locale: es }).toUpperCase();
        expect(dates[index]).toHaveTextContent(expectedDate);
      }
    }
  });

  test('Should render a fallback if formatted date is undefined', () => {
    renderComponent();

    const dates = screen.getAllByRole('status', { name: 'Fecha del encuentro' });

    expect(dates[2]).toHaveTextContent(/no disponible/i);
  });

  test('Should render the formatted hour and the fallback', () => {
    renderComponent();

    const hours = screen.getAllByRole('status', { name: 'Hora del encuentro' });

    expect(hours).toHaveLength(playoffMatchesMock.length);

    for (let index = 0; index < (playoffMatchesMock.length - 1); index++) {
      const matchHour = playoffMatchesMock[index].matchDate;
      if (matchHour) {
        const expectedHour = formatInTimeZone(matchHour, 'America/Mexico_City', 'h:mm a', { locale: es });
        expect(hours[index]).toHaveTextContent(expectedHour);
      }
    }
  });

  test('Should render a fallback if the formatted hour is undefined', () => {
    renderComponent();

    const hours = screen.getAllByRole('status', { name: 'Hora del encuentro' });

    expect(hours[2]).toHaveTextContent(/no disponible/i);
  });

  test('Should render score inputs for matches that are not completed', () => {
    renderComponent();

    const notCompleted = playoffMatchesMock.filter(
      (match) => match.status !== MATCH_STATUS.COMPLETED,
    );
    const localScores = screen.getAllByRole('spinbutton', { name: 'Marcador local' });
    const visitorScores = screen.getAllByRole('spinbutton', { name: 'Marcador visitante' });

    expect(localScores).toHaveLength(notCompleted.length);
    expect(visitorScores).toHaveLength(notCompleted.length);

    localScores.forEach((input, index) => {
      expect(input).toHaveValue(notCompleted[index].localScore);
    });
    visitorScores.forEach((input, index) => {
      expect(input).toHaveValue(notCompleted[index].visitorScore);
    });
  });

  test('Should render score badges for completed matches', () => {
    renderComponent();

    const completed = playoffMatchesMock.filter(
      (match) => match.status === MATCH_STATUS.COMPLETED,
    );
    const localScores = screen.getAllByRole('status', { name: 'Marcador local' });
    const visitorScores = screen.getAllByRole('status', { name: 'Marcador visitante' });

    expect(localScores).toHaveLength(completed.length);
    expect(visitorScores).toHaveLength(completed.length);

    localScores.forEach((badge, index) => {
      expect(badge).toHaveTextContent(String(completed[index].localScore));
    });
    visitorScores.forEach((badge, index) => {
      expect(badge).toHaveTextContent(String(completed[index].visitorScore));
    });
  });

  test('Should render the penalty shootout badges', () => {
    renderComponent();

    const matchesWithPenalties = playoffMatchesMock.filter(
      (match) => match.penaltyShootout?.status === MATCH_STATUS.COMPLETED,
    );
    const localPenalties = screen.getAllByRole('status', { name: 'Penales local' });
    const visitorPenalties = screen.getAllByRole('status', { name: 'Penales visitante' });

    expect(localPenalties).toHaveLength(matchesWithPenalties.length);
    expect(visitorPenalties).toHaveLength(matchesWithPenalties.length);

    localPenalties.forEach((badge, index) => {
      expect(badge).toHaveTextContent(String(matchesWithPenalties[index].penaltyShootout!.localGoals));
    });
    visitorPenalties.forEach((badge, index) => {
      expect(badge).toHaveTextContent(String(matchesWithPenalties[index].penaltyShootout!.visitorGoals));
    });
  });

  test('Should render the status column according to the match state', () => {
    renderComponent();

    const completed = playoffMatchesMock.filter(
      (match) => match.status === MATCH_STATUS.COMPLETED,
    );
    const notCompleted = playoffMatchesMock.filter(
      (match) => match.status !== MATCH_STATUS.COMPLETED,
    );

    const finishedStates = screen.getAllByRole('status', { name: 'Estado del encuentro' });
    expect(finishedStates).toHaveLength(completed.length);
    finishedStates.forEach((state) => expect(state).toHaveTextContent(/finalizado/i));

    expect(screen.getAllByTestId('match-status')).toHaveLength(notCompleted.length);
    expect(screen.getAllByTestId('finish-match')).toHaveLength(notCompleted.length);
  });

  test('Should render the action buttons per row', () => {
    renderComponent();

    expect(screen.getAllByTestId('show-info')).toHaveLength(playoffMatchesMock.length);
    expect(screen.getAllByTestId('edit-match')).toHaveLength(playoffMatchesMock.length);
    expect(screen.getAllByTestId('delete-match')).toHaveLength(playoffMatchesMock.length);
  });

  test('Should render the correct round badge classes', () => {
    renderComponent();

    const finalBadge = screen.getByText(PLAYOFF_ROUND.FINAL);

    expect(finalBadge).toHaveClass('border-emerald-500');
    expect(finalBadge).toHaveClass('text-emerald-500');
  });
});
