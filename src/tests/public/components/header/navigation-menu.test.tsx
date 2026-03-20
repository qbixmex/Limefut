import { NavigationMenu } from '@/app/(public)/components/header/navigation-menu';
import type { Navigation } from '@/app/(public)/components/header/navigation-menu/data';
import { render, screen } from '@testing-library/react';

describe('Test on <NavigationMenu /> component', () => {
  test('Should render correctly', () => {
    render(<NavigationMenu navigation={[]} />);

    screen.getByRole('menu', {
      name: /menu principal/i,
    });
  });

  test('Should render menu links', () => {
    const navigation: Navigation[] = [
      { id: 'du5i', label: 'Competency', url: '/competency', position: 1, links: [] },
      { id: 'bkd6', label: 'Standings', url: '/standings', position: 2, links: [] },
    ];

    render(<NavigationMenu navigation={navigation} />);

    navigation.forEach((navLink) => {
      const menuItem = screen.getByRole('link', {
        name: navLink.label,
      });
      expect(menuItem).toHaveAttribute('href', navLink.url);
    });
  });

  test('Should render menu items without a link', () => {
    const navigation: Navigation[] = [
      { id: 'w94j', label: 'Competency', url: '#', position: 1, links: [] },
      { id: 'bi38', label: 'Standings', url: '#', position: 2, links: [] },
    ];

    render(<NavigationMenu navigation={navigation} />);

    navigation.forEach((navLink) => {
      const menuItem = screen.getByRole('button', {
        name: navLink.label,
      });
      expect(menuItem).toBeInTheDocument();
    });
  });

  test('Should render submenu links', () => {
    const navigation: Navigation[] = [
      {
        id: 'bk2u',
        label: 'Competency',
        url: '#',
        position: 1,
        links: [
          { id: 'f83k', url: '/torneos', label: 'Torneos', position: 1 },
          { id: 'a2h5', url: '/equipos', label: 'Equipos', position: 2 },
        ],
      },
    ];

    render(<NavigationMenu navigation={navigation} />);

    navigation[0].links.forEach((subLink) => {
      const menuItem = screen.getByRole('menuitem', {
        name: subLink.label,
      });
      expect(menuItem).toHaveAttribute('href', subLink.url);
    });
  });
});
