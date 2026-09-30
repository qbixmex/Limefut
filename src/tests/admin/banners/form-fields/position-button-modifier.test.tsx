import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { PositionButtonModifier } from '@/app/admin/banners/(components)/form-fields/position-field/position-button-modifier';

describe('Test on <PositionButtonModifier />', () => {
  test('Should render correctly', () => {
    render(<PositionButtonModifier icon={Plus} modifyPosition={vi.fn()} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('Should call modifyPosition when clicked', async () => {
    const mockModifyPosition = vi.fn();
    render(<PositionButtonModifier icon={Plus} modifyPosition={mockModifyPosition} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockModifyPosition).toHaveBeenCalledOnce();
  });

  test('Should be disabled when the disabled prop is true', () => {
    render(<PositionButtonModifier icon={Plus} modifyPosition={vi.fn()} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
