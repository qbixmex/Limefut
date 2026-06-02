import { fetchPublicFieldsAction } from '../../(actions)/fetchPublicFieldsAction';
import { FieldFormSelect } from './form-select';

export const FieldSelect = async () => {
  const { fields } = await fetchPublicFieldsAction();

  return <FieldFormSelect fields={fields} />;
};
