import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { PositionButtonModifier } from '@/app/admin/banners/(components)/form-fields/position-field/position-button-modifier';

describe('Test on <PositionButtonModifier />', () => {
  const renderComponent = (modifyPosition = vi.fn(), disabled = false) => {
    render(<PositionButtonModifier icon={Plus} modifyPosition={modifyPosition} disabled={disabled} />);

    const user = userEvent.setup();
    const button = screen.getByRole('button');

    return { user, button, modifyPosition };
  };

  test('Should render correctly', () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('Should call modifyPosition when clicked', async () => {
    const { user, button, modifyPosition } = renderComponent();

    await user.click(button);

    expect(modifyPosition).toHaveBeenCalledOnce();
  });

  test('Should be disabled when the disabled prop is true', () => {
    const { button } = renderComponent(vi.fn(), true);

    expect(button).toBeDisabled();
  });
});
