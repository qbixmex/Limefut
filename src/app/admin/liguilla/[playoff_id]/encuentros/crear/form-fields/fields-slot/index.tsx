import type { FC } from 'react';
import { FieldSelect } from '../field-select';
import { fetchFieldsAction } from '../../../(actions)/fetch-fields.action';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}>;

export const FieldsSlot: FC<Props> = async ({
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const response = await fetchFieldsAction({
    authenticatedUserId,
    authenticatedUserRoles,
  });

  return (
    <FieldSelect fields={response.fields} />
  );
};
