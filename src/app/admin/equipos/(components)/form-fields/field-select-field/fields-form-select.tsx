'use client';

import { useMemo } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import type { FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{
  fields: FIELD_TYPE[];
}>;

type FIELD_TYPE = {
  id: string;
  name: string;
};

export const FieldsFormSelect: FC<Props> = ({ fields }) => {
  const { control, setValue } = useFormContext();
  const fieldsIds: string[] = useWatch({ name: 'fieldsIds' });
  const anchorRef = useComboboxAnchor();

  const fieldsMap = useMemo(() => {
    return new Map(fields.map(field => [field.id, field]));
  }, [fields]);

  const selectedFields = (fieldsIds.length > 0)
    ? fieldsIds
      .map(id => fieldsMap.get(id))
      .filter((field): field is FIELD_TYPE => !!field)
    : [] as FIELD_TYPE[];

  return (
    <div ref={anchorRef} className="w-full">
      <Controller
        control={control}
        name="fieldsIds"
        render={(({ fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Canchas <span className="text-orange-500">*</span>
            </FieldLabel>
            <Combobox
              multiple
              items={fields}
              itemToStringValue={(field) => field.name}
              value={selectedFields}
              onValueChange={(selectedField) => {
                const newIds = new Set<string>(selectedField.map(({ id }) => id));
                const currentSet = new Set<string>(fieldsIds ?? []);
                const removedFields = fieldsIds.filter(id => !newIds.has(id));
                const addedFields = selectedField
                  .filter(field => !currentSet.has(field.id))
                  .map(field => field.id);
                let updatedFields = [...fieldsIds];
                if (removedFields.length > 0) {
                  updatedFields = updatedFields.filter(id => !removedFields.includes(id));
                }
                if (addedFields.length > 0) updatedFields.push(...addedFields);
                setValue('fieldsIds', updatedFields);
              }}
            >
              <ComboboxChips className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((field: FIELD_TYPE) => (
                        <ComboboxChip key={field.id}>
                          {field.name}
                        </ComboboxChip>
                      ))}
                    </>
                  )}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Buscar cancha" />
                <ComboboxContent anchor={anchorRef}>
                  <ComboboxEmpty>No se encontró la cancha</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </ComboboxChips>
            </Combobox>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        ))}
      />
    </div>
  );
};
