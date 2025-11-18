'use client';

import { useEffect, useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
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
import { LoaderCircle, Mail } from 'lucide-react';
import type z from 'zod';
import sendEmailAction from '../../(actions)/contact/sendEmailAction';
import { toast } from 'sonner';
import { saveMessageAction } from '../(actions)/saveMessageAction';

export const ContactForm: FC = () => {
  const router = useRouter();
  const [messageReceived, setMessageReceived] = useState(false);
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    return () => {
      setMessageReceived(false);
    };
  }, []);

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

    await saveMessageAction(formData);

    toast.success(response.message);
    setMessageReceived(true);
    form.reset();

    setTimeout(() => {
      router.replace('/');
    }, 5000);
  };

  return (
    <>
      {messageReceived && (
        <div className="flex flex-col items-center">
          <h2 className="text-4xl text-center text-amber-500 italic">
            ¡ Tu mensaje ha sido enviado exitosamente !
          </h2>
          <Mail size={200} strokeWidth={1} className="stroke-sky-600" />
        </div>
      )}
      {!messageReceived && (
        <section className="w-full md:max-w-lg mx-auto">
          <p className="message mb-10">Ponte en contacto con nosotros y envíanos tu mensaje</p>

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
      )}
    </>
  );
};

export default ContactForm;
