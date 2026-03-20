import { MobileMenu } from '@/app/(public)/components/header/mobile-menu/';
import type { Navigation } from '@/app/(public)/components/header/navigation-menu/data';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Test on <MobileMenu /> component', () => {
  test('Should render default menu button', () => {
    const { openMenuButton } = renderComponent();

    expect(openMenuButton).toBeInTheDocument();
  });

  test('Should show mobile menu when opened', async () => {
    const { user, openMenuButton } = renderComponent();

    await user.click(openMenuButton);

    const mobileMenu = screen.getByRole('navigation', {
      name: /menú de navegación móvil/i,
    });
    expect(mobileMenu).toBeInTheDocument();
  });

  test('Should display button instead link', async () => {
    const { user, openMenuButton, navigationOne } = renderComponent();
    await user.click(openMenuButton);

    const menuItem = screen.getByTestId(`menu-item-${navigationOne.id}`);

    expect(menuItem).toHaveTextContent(navigationOne.label);
  });

  test('Should display a sub-links when parent item is click', async () => {
    const { user, openMenuButton, navigationOne } = renderComponent();
    await user.click(openMenuButton);
    const navigationButtonOne = screen.getByTestId(`menu-item-${navigationOne.id}`);
    await user.click(navigationButtonOne);

    const subLinks = screen.getByTestId(`sub-links-${navigationOne.id}`);
    expect(subLinks).not.toHaveClass('hidden');
    navigationOne.links.forEach((link) => {
      const menuItem = screen.getByRole('link', {
        name: new RegExp(`navegar a ${link.label}`, 'i'),
      });
      expect(menuItem).toHaveAttribute('href', link.url);
      expect(menuItem).toHaveTextContent(link.label);
    });
  });

  test('Should hide the previous opened sub-links on click new link', async () => {
    const { user, openMenuButton, navigationOne, navigationTwo } = renderComponent();
    await user.click(openMenuButton);
    const navigationButtonOne = screen.getByTestId(`menu-item-${navigationOne.id}`);
    const navigationButtonTwo = screen.getByTestId(`menu-item-${navigationTwo.id}`);

    await user.click(navigationButtonOne);
    await user.click(navigationButtonTwo);

    expect(
      screen.getByTestId(`sub-links-${navigationOne.id}`),
    ).toHaveClass('hidden');
    expect(
      screen.getByTestId(`sub-links-${navigationTwo.id}`),
    ).not.toHaveClass('hidden');
  });

  test('Should display a link if url is provided', async () => {
    const { user, openMenuButton, navigationThree } = renderComponent();

    await user.click(openMenuButton);

    const menuItem = screen.getByRole('link', {
      name: new RegExp(`navegar a ${navigationThree.label}`, 'i'),
    });

    expect(menuItem).toHaveAttribute('href', navigationThree.url);
    expect(menuItem).toHaveTextContent(navigationThree.label);
  });

  test('Should close mobile menu on click close icon', async () => {
    const { openMenuButton, user } = renderComponent();
    await user.click(openMenuButton);
    const closeButton = screen.getByLabelText(/cerrar menú/i);
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    const navigationMenu = screen.queryByRole('navigation', {
      name: /menú de navegación/i,
    });

    expect(navigationMenu).not.toBeInTheDocument();
  });
});

function renderComponent() {
  const navigation: Navigation[] = [
    {
      id: 'du5i',
      label: 'Competency',
      url: '#',
      position: 1,
      links: [
        {
          id: '48gu',
          url: '/tournaments',
          label: 'Tournaments',
          position: 1,
        },
        {
          id: '5u37',
          label: 'Teams',
          url: '/teams',
          position: 2,
        },
      ],
    },
    {
      id: 'axa4',
      label: 'Standings',
      url: '#',
      position: 2,
      links: [
        {
          id: 'h4g9',
          url: '/positions-table',
          label: 'Position Table',
          position: 1,
        },
        {
          id: 'xh45',
          label: 'Concentrated',
          url: '/concentrated',
          position: 2,
        },
      ],
    },
    {
      id: 'xg72',
      label: 'Contact',
      url: '/contact',
      position: 3,
      links: [],
    },
  ];
  render(<MobileMenu navigation={navigation} />);

  const user = userEvent.setup();
  const openMenuButton = screen.getByRole('button', { name: /abrir menú/i });
  const navigationOne = navigation[0];
  const navigationTwo = navigation[1];
  const navigationThree = navigation[2];

  return {
    user,
    openMenuButton,
    navigationOne,
    navigationTwo,
    navigationThree,
  };
}
