import { MatchGroup } from '@/app/(public)/liguilla/encuentro/match-view/match-group';
import { render, screen } from '@testing-library/react';
import { MATCH_GROUP } from '@/shared/enums/match-group.enum';

describe('Tests on MatchGroup', () => {
  test('Should render the gold badge for the golder group', () => {
    render(<MatchGroup group={MATCH_GROUP.GOLDER} />);

    expect(screen.getByText('oro')).toBeInTheDocument();
  });

  test('Should render the silver badge for the silvered group', () => {
    render(<MatchGroup group={MATCH_GROUP.SILVERED} />);

    expect(screen.getByText('plata')).toBeInTheDocument();
  });

  test('Should render the general badge for any other group', () => {
    render(<MatchGroup group="regular" />);

    expect(screen.getByText('general')).toBeInTheDocument();
  });
});
