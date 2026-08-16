import type { FC } from 'react';
import { FieldSelect } from '../field-select';
import { fetchFieldsAction } from '../../../(actions)/fetch-fields.action';

type Props = Readonly<Record<string, never>>;

export const FieldsSlot: FC<Props> = async () => {
  const response = await fetchFieldsAction();

  return (
    <FieldSelect fields={response.fields} />
  );
};
