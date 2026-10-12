import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { StatusField } from '@/app/admin/encuentros/(components)/form-fields/status-field';
import { MATCH_STATUS } from '@/shared/enums';
import { getStatusTranslation } from '@/lib/utils';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({ defaultValues: { status: undefined } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const status = useWatch({ name: 'status' });
  return <span data-testid="status-value">{status}</span>;
}

describe('Test on <StatusField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <StatusField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox');

    return { user, combobox };
  };

  test('Should render the label and the select', () => {
    const { combobox } = renderComponent();

    const label = screen.getByText('Estado');
    const placeholder = screen.getByText(/seleccione estado/i);

    expect(label).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(placeholder).toBeInTheDocument();
  });

  test('Should update the form value when selecting in review option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getStatusTranslation(MATCH_STATUS.IN_REVIEW),
    });
    await user.click(option);

    await waitFor(() => {
      const statusValue = screen.getByTestId('status-value');
      expect(statusValue).toHaveTextContent(MATCH_STATUS.IN_REVIEW);
    });
  });

  test('Should update the form value when selecting scheduled option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getStatusTranslation(MATCH_STATUS.SCHEDULED),
    });
    await user.click(option);

    await waitFor(() => {
      const statusValue = screen.getByTestId('status-value');
      expect(statusValue).toHaveTextContent(MATCH_STATUS.SCHEDULED);
    });
  });

  test('Should update the form value when selecting in progress option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getStatusTranslation(MATCH_STATUS.IN_PROGRESS),
    });
    await user.click(option);

    await waitFor(() => {
      const statusValue = screen.getByTestId('status-value');
      expect(statusValue).toHaveTextContent(MATCH_STATUS.IN_PROGRESS);
    });
  });

  test('Should update the form value when selecting post posed option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getStatusTranslation(MATCH_STATUS.POST_POSED),
    });
    await user.click(option);

    await waitFor(() => {
      const statusValue = screen.getByTestId('status-value');
      expect(statusValue).toHaveTextContent(MATCH_STATUS.POST_POSED);
    });
  });

  test('Should update the form value when selecting canceled option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getStatusTranslation(MATCH_STATUS.CANCELED),
    });
    await user.click(option);

    await waitFor(() => {
      const statusValue = screen.getByTestId('status-value');
      expect(statusValue).toHaveTextContent(MATCH_STATUS.CANCELED);
    });
  });
});
