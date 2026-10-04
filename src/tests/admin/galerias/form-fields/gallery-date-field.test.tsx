import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryDateField } from '@/app/admin/galerias/(components)/form-fields/gallery-date-field';
import { createGallerySchema } from '@/shared/schemas';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createGallerySchema) as any,
    defaultValues: { title: '', permalink: '', galleryDate: undefined, active: false },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function SetValidDate() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('galleryDate', new Date(2025, 5, 15), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <GalleryDateField />', () => {
  test('Should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        <GalleryDateField />
      </TestWrapper>,
    );

    const button = container.querySelector('#date-picker');
    const label = screen.getByLabelText(/fecha/i);

    expect(label).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/selecciona fecha/i);
  });

  test('Should not show an error by default', () => {
    render(
      <TestWrapper>
        <GalleryDateField />
      </TestWrapper>,
    );

    const alert = screen.queryByRole('alert');

    expect(alert).not.toBeInTheDocument();
  });

  test('Should show the formatted date when a value is set', async () => {
    render(
      <TestWrapper>
        <GalleryDateField />
        <SetValidDate />
      </TestWrapper>,
    );

    const date = await screen.findByText('15 de junio del 2025');

    expect(date).toBeInTheDocument();
  });

  test('Should open the calendar popover when the button is clicked', async () => {
    const { container } = render(
      <TestWrapper>
        <GalleryDateField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const button = container.querySelector('#date-picker') as HTMLButtonElement;

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
