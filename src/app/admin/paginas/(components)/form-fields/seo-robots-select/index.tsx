import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export const SeoRobotsSelect: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="seoRobots"
      render={({ field, fieldState, formState }) => (
        <Field>
          <FieldLabel>Robots SEO</FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              className={cn('w-full', {
                [styles.selectError]: formState.errors.seoRobots,
              })}
            >
              <SelectValue placeholder="Seleccione una Opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index, follow">Indexar y Seguir</SelectItem>
              <SelectItem value="index, nofollow">Indexar y No Seguir</SelectItem>
              <SelectItem value="noindex, follow">No Indexar y Seguir</SelectItem>
              <SelectItem value="noindex, nofollow">No Indexar y No Seguir</SelectItem>
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
