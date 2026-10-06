import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PublishedDateField } from '@/app/admin/noticias/(components)/form-fields/published-date-field';
import { CreateAnnouncementSchema } from '@/shared/schemas';

function TestWrapper({
  children,
  publishedDate,
}: Readonly<{ children: ReactNode; publishedDate?: Date }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateAnnouncementSchema) as any,
    defaultValues: {
      title: '',
      permalink: '',
      publishedDate,
      description: '',
      content: '',
      active: false,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger();
  }, [trigger]);
  return null;
}

describe('Test on <PublishedDateField />', () => {
  test('Should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        <PublishedDateField />
      </TestWrapper>,
    );

    const button = container.querySelector('#date-picker');
    const label = screen.getByLabelText(/fecha de publicación/i);

    expect(label).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/seleccione la fecha de publicación/i);
  });

  test('Should not show an error by default', () => {
    render(
      <TestWrapper>
        <PublishedDateField />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when no date is selected', async () => {
    render(
      <TestWrapper>
        <PublishedDateField />
        <TriggerValidation />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent('Selecciona la fecha de publicación');
  });

  test('Should show the formatted date when a value is provided', () => {
    const { container } = render(
      <TestWrapper publishedDate={new Date(2025, 5, 15)}>
        <PublishedDateField />
      </TestWrapper>,
    );

    const button = container.querySelector('#date-picker');

    expect(button).toHaveTextContent('15 de junio del 2025');
  });

  test('Should open the calendar popover when the button is clicked', async () => {
    const { container } = render(
      <TestWrapper>
        <PublishedDateField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const button = container.querySelector('#date-picker') as HTMLButtonElement;

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');

    const calendar = await screen.findByTestId('calendar');
    expect(calendar).toBeInTheDocument();
  });
});
