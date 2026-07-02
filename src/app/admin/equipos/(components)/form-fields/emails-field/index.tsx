'use client';

import type { FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './styles.module.css';

export const EmailsField: FC = () => {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  return (
    <Controller
      name="emails"
      control={control}
      render={({ field, fieldState }) => {
        const emails: string[] = field.value ?? [];

        const addEmail = () => {
          const trimmed = inputValue.trim();
          if (!trimmed) return;
          if (emails.some(e => e.toLowerCase() === trimmed.toLowerCase())) return;
          field.onChange([...emails, trimmed]);
          setInputValue('');
        };

        const removeEmail = (city: string) => {
          field.onChange(emails.filter(e => e !== city));
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addEmail();
          }
          if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
            removeEmail(emails[emails.length - 1]);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Correo(s) <span className="text-gray-500">(opcional)</span>
            </FieldLabel>
            <div className={styles.emailsContainer}>
              <Input
                ref={field.ref}
                name={field.name}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                className={styles.formInput}
                placeholder={
                  emails.length === 0
                    ? 'escriba un correo y presiona enter'
                    : 'agregar otro'
                }
              />
              <div
                className={styles.emailsCaptured}
                style={{ display: emails.length > 0 ? 'flex' : 'none' }}
              >
                {emails.map(email => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className={styles.removeBtn}
                      aria-label={`Eliminar ${email}`}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
