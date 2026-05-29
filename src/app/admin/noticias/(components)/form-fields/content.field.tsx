'use client';

import { MdEditorField } from '@/app/admin/paginas/(components)/md-editor-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const ContentField = () => {
  return (
    <FormField
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Contenido <span className="text-amber-500">*</span>
          </FormLabel>
          <FormControl>
            <MdEditorField
              markdownString={field.value}
              setContent={value => field.onChange(value)}
              // resourceId={announcement?.id as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
