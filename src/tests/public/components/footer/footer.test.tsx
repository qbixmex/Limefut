import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { Footer } from '@/app/(public)/components';

vi.mock('@/app/(public)/components/footer/footer-links', () => ({
  FooterLinks: () => {
    throw new Promise(() => {});
  },
}));

describe('Test on <Footer /> component', () => {
  test('Should render correctly', () => {
    const { container } = render(<Footer />);
    const mainWrapper = container.querySelector('#footer');
    expect(mainWrapper).toBeInTheDocument();
  });

  test('Should render skeleton loader for footer links', async () => {
    render(<Footer />);
    const skeleton = screen.getByRole('status', { name: /cargando/i });
    expect(skeleton).toBeInTheDocument();
  });

  test('Should render page links', async () => {
    render(<Footer />);
    const pageLinks = await screen.findByLabelText(/enlaces del pie de página/i);
    expect(pageLinks).toBeInTheDocument();
  });

  test('Should render social media', async () => {
    render(<Footer />);
    const socialMedia = await screen.findByLabelText(/redes sociales/i);
    expect(socialMedia).toBeInTheDocument();
  });

  test('Should have a copyright message', () => {
    render(<Footer />);

    const copyright = screen.getByLabelText(/derechos reservados/i);

    expect(copyright).toBeInTheDocument();
  });
});
