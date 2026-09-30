import { render, screen } from '@testing-library/react';
import { StandingsAbbreviations } from '@/app/admin/estadisticas/(components)/standings-table/standings-abbreviations';

describe('Tests on <StandingsAbbreviations /> component', () => {
  test('Should render every abbreviation with its description', () => {
    render(<StandingsAbbreviations />);

    const abbreviations = [
      ['JJ', 'Juegos Jugados'],
      ['JG', 'Juegos Ganados'],
      ['JP', 'Juegos Perdidos'],
      ['GF', 'Goles a Favor'],
      ['GC', 'Goles en Contra'],
      ['DIF', 'Diferencia de Goles'],
      ['PTS', 'Puntos'],
      ['PTA', 'Puntos Adicionales'],
      ['PTT', 'Puntos Totales'],
    ];

    for (const [, description] of abbreviations) {
      const text = screen.getByText(description);
      expect(text).toBeInTheDocument();
    }
  });
});
