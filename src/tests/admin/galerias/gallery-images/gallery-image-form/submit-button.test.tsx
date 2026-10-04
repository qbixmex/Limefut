import { render, screen } from '@testing-library/react';
import { SubmitButton } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/submit-button';

describe('Test on <SubmitButton />', () => {
  test('Should render the label and be enabled when not submitting', () => {
    render(<SubmitButton isSubmitting={false} label="Guardar" />);

    const button = screen.getByRole('button', { name: /guardar/i });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('Should show the loading state and be disabled when submitting', () => {
    render(<SubmitButton isSubmitting label="Guardar" />);

    const button = screen.getByRole('button', { name: /espere/i });

    expect(button).toBeDisabled();
    expect(screen.getByText(/espere/i)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /icono de carga/i }),
    ).toBeInTheDocument();
  });
});
