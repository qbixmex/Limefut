'use client';

import type { FC } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendMessageSchema } from '@/shared/schemas';
import { LoaderCircle } from 'lucide-react';
import type z from 'zod';
import sendEmailAction from '../../(actions)/contact/sendEmailAction';
import { toast } from 'sonner';

export const ContactForm: FC = () => {
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      name: 'Daniel González Briseño',
      email: 'qbixmex@gmail.com',
      message: 'Mensaje de pruebas',
    },
  });

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('message', data.message);

    const response = await sendEmailAction(formData);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset();
    return;
  };

  return (
    <section className="w-full md:max-w-lg mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span>*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico <span>*</span></FormLabel>
                <FormControl>
                  <Input {...field} className="border-emerald-800" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje <span>*</span></FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="submit-button"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                  <span className="text-sm italic">Espere</span>
                  <LoaderCircle className="size-4 animate-spin" />
                </span>
              ) : (
                <span>enviar</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ContactForm;
