import { RolesMatches } from '@/app/(public)/resultados/(components)/roles-matches';
import { render, screen } from '@testing-library/react';
import { matches, matchesWithoutDates, matchesWithoutPlaces, matchesWithPenalties } from './data/matches';
import { TooltipProvider } from '@/components/ui/tooltip';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { getMatchStatus } from '@/app/(public)/resultados/(helpers)/status';

describe('Test on <RolesMatches /> component', () => {
  test('Should render correctly', () => {
    render(<RolesMatches matches={[]} />);
  });

  test('Should show matches day date', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchDays = screen.getAllByRole('date', { name: /día del partido/i });

    matchDays.forEach((day, index) => {
      const expectedDay = `${matches[index].matchDate?.getDate()}`.padStart(2, '0');
      expect(day).toHaveTextContent(expectedDay);
    });
  });

  test('Should matches month date', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchMonths = screen.getAllByRole('date', { name: /mes del partido/i });

    matchMonths.forEach((day, index) => {
      const expectedMonth = matches[index].matchDate?.toLocaleString('es-ES', { month: 'long' });
      expect(day).toHaveTextContent(expectedMonth!);
    });
  });

  test('Should matches year date', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchMonths = screen.getAllByRole('date', { name: /año del partido/i });

    matchMonths.forEach((day, index) => {
      const expectedYear = matches[index].matchDate?.getFullYear().toString();
      expect(day).toHaveTextContent(expectedYear!);
    });
  });

  test('Should show not defined message if date is null', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matchesWithoutDates} />
      </TooltipProvider>,
    );

    const matchDays = screen.getAllByRole('date', { name: /Fecha del partido no definida/i });

    matchDays.forEach((element) => {
      expect(element).toHaveTextContent(/no definida/i);
    });
  });

  test('Should matches hour date', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchMonths = screen.getAllByRole('time', { name: /hora del partido/i });

    matchMonths.forEach((day, index) => {
      const matchDate = matches[index].matchDate;
      const expectedHour = formatInTimeZone(matchDate as Date, 'America/Mexico_City', 'h:mm aaa', { locale: es });
      expect(day).toHaveTextContent(expectedHour);
    });
  });

  test('Should show not defined message if time is null', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matchesWithoutDates} />
      </TooltipProvider>,
    );

    const matchMonths = screen.getAllByRole('time', { name: /hora del partido/i });

    matchMonths.forEach((element) => {
      expect(element).toHaveTextContent(/no definida/i);
    });
  });

  test('Should show match place', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchLocations = screen.getAllByRole('location', { name: /sede del partido/i });

    matchLocations.forEach((element, index) => {
      expect(element).toHaveTextContent(matches[index].place!);
    });
  });

  test('Should show not defined message if match place is null', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matchesWithoutPlaces} />
      </TooltipProvider>,
    );

    const matchLocations = screen.getAllByRole('location', { name: /sede del partido no definida/i });

    matchLocations.forEach((element) => {
      expect(element).toHaveTextContent(/no definida/i);
    });
  });

  test('Should matches status', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchStatuses = screen.getAllByRole('status', { name: /estado del partido/i });

    matchStatuses.forEach((element, index) => {
      const expectedStatus = getMatchStatus(matches[index].status as MATCH_STATUS_TYPE).label;
      expect(element).toHaveTextContent(expectedStatus!);
    });
  });

  test('Should show matches team names', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const localTeamNames = screen.getAllByRole('team-name', { name: /nombre equipo local/i });

    localTeamNames.forEach((element, index) => {
      expect(element).toHaveTextContent(matches[index].local.name);
    });

    const visitorTeamNames = screen.getAllByRole('team-name', { name: /nombre equipo visitante/i });

    visitorTeamNames.forEach((element, index) => {
      expect(element).toHaveTextContent(matches[index].visitor.name);
    });
  });

  test('Should show the matches scores', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const localScores = screen.getAllByRole('score', { name: /goles equipo local/i });

    localScores.forEach((score, index) => {
      expect(score).toHaveTextContent(matches[index].localScore.toString());
    });

    const visitorScores = screen.getAllByRole('score', { name: /goles equipo visitante/i });

    visitorScores.forEach((score, index) => {
      expect(score).toHaveTextContent(matches[index].visitorScore.toString());
    });
  });

  test('Should not show penalty kicks if no one was made', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const localPenalties = screen.queryAllByRole('score', { name: /Penales equipo local/i });
    expect(localPenalties).toHaveLength(0);

    const visitorPenalties = screen.queryAllByRole('score', { name: /Penales equipo visitante/i });

    expect(visitorPenalties).toHaveLength(0);
  });

  test('Should show penalties shoots', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matchesWithPenalties} />
      </TooltipProvider>,
    );

    const localPenalties = screen.queryAllByRole('score', { name: /Penales equipo local/i });

    expect(localPenalties).toHaveLength(2);
    localPenalties.forEach((penalty, index) => {
      const score = matchesWithPenalties[index].penaltyShootout!.localGoals.toString();
      expect(penalty).toHaveTextContent(score);
    });

    const visitorPenalties = screen.queryAllByRole('score', { name: /Penales equipo visitante/i });

    expect(visitorPenalties).toHaveLength(2);
    visitorPenalties.forEach((penalty, index) => {
      const score = matchesWithPenalties[index].penaltyShootout!.visitorGoals.toString();
      expect(penalty).toHaveTextContent(score);
    });
  });

  test('Should contains match link', () => {
    render(
      <TooltipProvider>
        <RolesMatches matches={matches} />
      </TooltipProvider>,
    );

    const matchLinks = screen.getAllByRole('button', { name: /detalles del partido entre/i });

    matchLinks.forEach((link, index) => {
      const expectedHref = `/resultados/${matches[index].id}/${matches[index].local.permalink}-vs-${matches[index].visitor.permalink}`;
      expect(link).toHaveAttribute('href', expectedHref);
    });
  });
});
