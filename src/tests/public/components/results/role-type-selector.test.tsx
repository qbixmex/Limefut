import { render, screen } from '@testing-library/react';
import { RoleTypeSelector } from '@/app/(public)/components/roles/role-type-selector';
import userEvent from '@testing-library/user-event';

const handleRoleSelectionMock = vi.fn();
vi.mock('@/app/(public)/components/roles/use-role-type-selector', () => ({
  useRoleTypeSelector: () => ({
    handleRoleSelection: handleRoleSelectionMock,
    rolesState: { complete: false, team: false, field: false },
  }),
}));

describe('Tests on <RoleTypeSelector />', () => {
  test('Should render correctly', async () => {
    render(<RoleTypeSelector />);

    const navigation = screen.getByRole('navigation', {
      name: /selector de rol/i,
    });

    expect(navigation).toBeInTheDocument();
  });

  test('Should call handleRoleSelection on click complete role button', async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /completo/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledWith('complete');
  });

  test('Should call handleRoleSelection on click team role button', async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /equipo/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledWith('team');
  });

  test.skip('Should call handleRoleSelection on click field role button', async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /cancha/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledWith('field');
  });

  test("Should remove 'roles=complete' from url", async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /completo/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledTimes(2);
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(1, 'complete');
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(2, 'complete');
  });

  test("Should remove 'roles=team' from url", async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /equipo/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledTimes(2);
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(1, 'team');
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(2, 'team');
  });

  test.skip("Should remove 'roles=field' from url", async () => {
    render(<RoleTypeSelector />);

    const button = screen.getByRole('button', {
      name: /cancha/i,
    });
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);

    await user.click(button);

    expect(handleRoleSelectionMock).toHaveBeenCalledTimes(2);
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(1, 'field');
    expect(handleRoleSelectionMock).toHaveBeenNthCalledWith(2, 'field');
  });
});
