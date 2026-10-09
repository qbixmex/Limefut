import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';

export const StatusSelect = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="status"
      render={({ field, fieldState, formState }) => (
        <Field>
          <FieldLabel>Estado</FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              className={cn('w-full', {
                'border-destructive ring ring-destructive': formState.errors.seoRobots,
              })}
            >
              <SelectValue placeholder="Seleccione una Opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="hold">Retenido</SelectItem>
              <SelectItem value="unpublished">No Publicado</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
