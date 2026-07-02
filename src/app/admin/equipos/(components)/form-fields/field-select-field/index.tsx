import type { FC } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { fetchFieldsForTeam } from '../../../(actions)/fetchFieldsForTeam';
import { FieldsFormSelect } from './fields-form-select';

export const FieldSelectField: FC = async () => {
  const { ok, message, fields } = await fetchFieldsForTeam();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <FieldsFormSelect fields={fields} />
  );
};
