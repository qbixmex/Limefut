import { render } from '@testing-library/react';
import { TournamentsSelectorSkeleton } from '@/app/admin/estadisticas/(components)/tournaments-wrapper/tournaments-selector-skeleton';

describe('Tests on <TournamentsSelectorSkeleton /> component', () => {
  test('Should render the animated placeholder', () => {
    const { container } = render(<TournamentsSelectorSkeleton />);

    const placeholder = container.firstChild;

    expect(placeholder).toBeInTheDocument();
  });
});
