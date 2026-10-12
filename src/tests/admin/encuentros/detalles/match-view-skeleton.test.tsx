import { render, screen } from '@testing-library/react';
import { MatchViewSkeleton } from '@/app/admin/encuentros/detalles/[id]/match-view-skeleton';

describe('Test on <MatchViewSkeleton /> component', () => {
  test('Should render the loading status', () => {
    render(<MatchViewSkeleton />);

    expect(screen.getByRole('status', { name: /cargando datos/i })).toBeInTheDocument();
  });
});
