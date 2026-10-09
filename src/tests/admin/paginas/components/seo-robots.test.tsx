import { render, screen } from '@testing-library/react';
import { SeoRobots } from '@/app/admin/paginas/(components)/seo-robots';
import { ROBOTS } from '@/shared/interfaces/Page';

describe('Tests on <SeoRobots /> component', () => {
  test('Should render the translated robots value', () => {
    render(<SeoRobots robots={ROBOTS.INDEX_FOLLOW} />);

    expect(screen.getByText(/indexar, seguir/i)).toBeInTheDocument();
  });

  test('Should render the no-index variant', () => {
    render(<SeoRobots robots={ROBOTS.NO_INDEX_NO_FOLLOW} />);

    expect(screen.getByText(/no indexar, no seguir/i)).toBeInTheDocument();
  });

  test('Should fallback for an unknown robots value', () => {
    render(<SeoRobots robots={undefined as unknown as ROBOTS} />);

    expect(screen.getByText(/no indexar, no seguir/i)).toBeInTheDocument();
  });
});
