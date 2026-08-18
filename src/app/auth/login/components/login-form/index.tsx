'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signInAction } from '@/app/(auth)/signInAction';
import { toast } from 'sonner';
import './styles.css';
import { ROUTES } from '@/shared/constants/routes';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' },
    ),
  password: z.string().min(8, {
    message: '¡ La contraseña debe ser por lo menos de 8 caracteres !',
  }),
});

export const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

    const { ok, message } = await signInAction(formData);

    if (!ok) {
      toast.error(message);
      return;
    }

    form.reset();
    toast.success(message);

    // Redirect to dashboard using hard refresh
    window.location.replace(ROUTES.ADMIN_DASHBOARD);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="label">
                Correo Electrónico
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                className="input"
                aria-label="Correo electrónico"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="label">Contraseña</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type={passwordVisible ? 'text' : 'password'}
                  className="input"
                  aria-label="Contraseña"
                  aria-invalid={fieldState.invalid}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(prev => !prev)}
                  className={cn('showHidePassword', {
                    hidden: field.value?.length === 0,
                  })}
                >
                  {passwordVisible ? <Eye /> : <EyeClosed />}
                </button>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <div className="submitWrapper">
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="submitButton"
            disabled={form.formState.isSubmitting}
            aria-label="Acceder"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span className="text-sm">acceder</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
