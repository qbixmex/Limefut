'use client';

import type { FC } from 'react';
import { Field, FieldError } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import MdEditorField from '../../md-editor-field';
import type { CustomPageImage } from '@/shared/interfaces/Page';

type Props = Readonly<{
  pageId: string;
  updateContentImage: (pageImage: CustomPageImage) => void;
}>;

export const ContentTextArea: FC<Props> = ({ pageId, updateContentImage }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="content"
      render={({ field, fieldState }) => (
        <Field>
          <MdEditorField
            markdownString={field.value}
            setContent={value => field.onChange(value)}
            resourceId={pageId}
            updateContentImage={updateContentImage}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
