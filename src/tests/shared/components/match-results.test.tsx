import { render, screen } from '@testing-library/react';
import { MatchResults } from '@/shared/components/match-results';

const local = {
  name: 'Club América',
  href: '/equipos/club-america?tournament=liga-mx&category=sub-15',
  imageUrl: null,
};

const visitor = {
  name: 'Deportivo Lime',
  href: '/equipos/deportivo-lime?tournament=liga-mx&category=sub-15',
  imageUrl: null,
};

describe('Tests on <MatchResults />', () => {
  test('Should render both team links with their href', () => {
    render(
      <MatchResults
        local={local}
        visitor={visitor}
        localScore={2}
        visitorScore={1}
      />,
    );

    const localLink = screen.getByRole('link', { name: local.name });
    const visitorLink = screen.getByRole('link', { name: visitor.name });

    expect(localLink).toHaveAttribute('href', local.href);
    expect(visitorLink).toHaveAttribute('href', visitor.href);
    expect(localLink).toHaveAttribute('target', '_blank');
    expect(visitorLink).toHaveAttribute('target', '_blank');
    expect(localLink).toHaveAttribute('rel', 'noreferrer');
    expect(visitorLink).toHaveAttribute('rel', 'noreferrer');
  });

  test('Should render both scores with their accessible labels', () => {
    render(
      <MatchResults
        local={local}
        visitor={visitor}
        localScore={2}
        visitorScore={1}
      />,
    );

    expect(
      screen.getByRole('status', { name: 'Anotaciones del equipo local' }),
    ).toHaveTextContent('2');
    expect(
      screen.getByRole('status', { name: 'Anotaciones del equipo visitante' }),
    ).toHaveTextContent('1');
  });

  test('Should render the team shields when there is an image', () => {
    render(
      <MatchResults
        local={{ ...local, imageUrl: '/images/america.png' }}
        visitor={{ ...visitor, imageUrl: '/images/lime.png' }}
        localScore={2}
        visitorScore={1}
      />,
    );

    expect(screen.getByAltText(`${local.name} escudo`)).toBeInTheDocument();
    expect(screen.getByAltText(`${visitor.name} escudo`)).toBeInTheDocument();
  });

  test('Should not render an image when the team has no image', () => {
    render(
      <MatchResults
        local={local}
        visitor={visitor}
        localScore={2}
        visitorScore={1}
      />,
    );

    expect(
      screen.queryByAltText(`${local.name} escudo`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(`${visitor.name} escudo`),
    ).not.toBeInTheDocument();
  });
});
