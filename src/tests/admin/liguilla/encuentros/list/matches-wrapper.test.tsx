import { render, screen } from '@testing-library/react';
import { MatchesWrapper } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/matches-wrapper';
import { playoffId } from '../mocks/playoff.mock';
import { playoffMatchesMock } from '../mocks/playoff-matches.mock';

const tableProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/matches-table', () => ({
  MatchesTable: (props: unknown) => {
    tableProps.current = props;
    return <div data-testid="matches-table" />;
  },
}));

describe('Tests on <MatchesWrapper />', () => {
  beforeEach(() => {
    tableProps.current = undefined;
  });

  const renderComponent = () => {
    render(
      <MatchesWrapper
        playoffId={playoffId}
        matches={playoffMatchesMock}
      />,
    );
  };

  test('Should render <MatchesTable />', () => {
    renderComponent();

    const matchesTable = screen.getByTestId('matches-table');

    expect(matchesTable).toBeInTheDocument();
  });

  test('Should pass the playoff id and matches to <MatchesTable />', async () => {
    renderComponent();

    expect(tableProps.current).toEqual({
      playoffId,
      matches: playoffMatchesMock,
    });
  });
});
