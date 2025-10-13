'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleLoginCredentials } from '@/app/(auth)/handleLoginCredentials';
import { toast } from 'sonner';
import './styles.css';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' }
    ),
  password: z.string().min(8, {
    message: '¡ La contraseña debe ser por lo menos de 8 caracteres!'
  }),
});

export const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    const response = await handleLoginCredentials({ email, password });
    if (response === 'Success') {
      form.reset();
    } else {
      toast.error(response);
    }
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      toast.success('¡ Has iniciado sesión correctamente !');
      window.location.href = "/admin/dashboard";
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label">
                Correo Electrónico
              </FormLabel>
              <FormControl>
                <Input {...field} className="input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label">Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={passwordVisible ? 'text' : 'password'}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(prev => !prev)}
                    className={cn('showHidePassword', {
                      'hidden': field.value.length === 0,
                    })}
                  >
                    {passwordVisible ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="submitWrapper">
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="submitButton"
          >
            acceder
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;