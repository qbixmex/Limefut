import { EmptyMatches } from '@/app/(public)/resultados/(components)/empty-matches';
import { render, screen } from '@testing-library/react';

describe('Test on <EmptyMatches /> component', () => {
  test('Should render correctly', () => {
    render(<EmptyMatches />);

    expect(
      screen.getByRole('img', { name: /icono/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('alert', { name: /encuentros/i }),
    ).toBeInTheDocument();
  });
});
