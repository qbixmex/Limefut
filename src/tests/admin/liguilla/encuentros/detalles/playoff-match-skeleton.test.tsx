import { render, screen } from '@testing-library/react';
import { PlayoffMatchSkeleton } from '@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/playoff-match-skeleton';

describe('Tests on <PlayoffMatchSkeleton />', () => {
  test('Should render the loading status', () => {
    render(<PlayoffMatchSkeleton />);

    expect(
      screen.getByRole('status', { name: /cargando datos/i }),
    ).toBeInTheDocument();
  });
});
