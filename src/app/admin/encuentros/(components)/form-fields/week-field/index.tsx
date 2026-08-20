'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './styles.module.css';

export const WeekField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="week"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="selected-week">Jornada</FieldLabel>
          <div className={styles.weekSelector}>
            <div className={styles.weekGroup}>
              <Button
                variant="outline-primary"
                type="button"
                size="icon"
                onClick={() => field.onChange(Math.max(0, (Number(field.value) || 0) - 1))}
                className={styles.modifyQuantityButtons}
                disabled={field.value === 0}
              >
                <MinusIcon className="size-6" strokeWidth={3} />
              </Button>
              <input
                id="selected-week"
                name="week"
                value={field.value}
                onChange={(event) => {
                  field.onChange(Number(event.target.value || '0'));
                }}
                className={styles.weekInput}
                aria-invalid={fieldState.invalid}
              />
              <Button
                variant="outline-primary"
                type="button"
                size="icon"
                className={styles.modifyQuantityButtons}
                onClick={() => {
                  field.onChange(Number(field.value || '0') + 1);
                }}
              >
                <PlusIcon className="size-6" />
              </Button>
            </div>
          </div>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
