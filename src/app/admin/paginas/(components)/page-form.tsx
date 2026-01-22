'use client';

import { type FC } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createPageSchema, editPageSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
// import { createUserAction } from '../(actions)';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import type { Page } from '@/shared/interfaces';
import { ROBOTS } from '@/shared/interfaces';
import { Textarea } from '~/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/src/components/ui/select';
import { cn } from '~/src/lib/utils';
import { createPageAction } from '../(actions)/createPageAction';
// import { updateUserAction } from '../(actions)/updateUserAction';

type Props = Readonly<{
  session: Session;
  page?: Page;
}>;

export const PageForm: FC<Props> = ({ session, page }) => {
  const route = useRouter();

  const formSchema = !page ? createPageSchema : editPageSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title ?? '',
      permalink: page?.permalink ?? '',
      content: page?.content ?? '',
      seoTitle: page?.seoTitle ?? undefined,
      seoDescription: page?.seoDescription ??  undefined,
      seoRobots: page?.seoRobots ?? undefined,
      active: page?.active ?? true,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('content', data.content as string);
    formData.append('seoTitle', data.seoTitle as string);
    formData.append('seoDescription', data.seoDescription as string);
    formData.append('seoRobots', data.seoRobots as string);
    formData.append('active', String(data.active ?? false));

    // Create Page
    if (!page) {
      const response = await createPageAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        route.replace("/admin/paginas");
        return;
      }
      return;
    }

    if (page) {
      // const response = await updateUserAction({
      //   formData,
      //   userId: user.id,
      //   userRoles: session.user.roles,
      //   authenticatedUserId: session?.user.id,
      // });

      // if (!response.ok) {
      //   toast.error(response.message);
      //   return;
      // }

      // if (response.ok) {
      //   toast.success(response.message);
      //   route.replace("/admin/usuarios");
      //   return;
      // }
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Title and Permalink */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Página</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <FormField
              control={form.control}
              name="permalink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace Permanente</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <h2 className="text-xl font-semibold text-sky-500">Contenido</h2>

        <section>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    className="min-h-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <h2 className="text-xl font-semibold text-sky-500">SEO</h2>

        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título SEO</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoRobots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robots SEO</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={undefined}
                      value={field.value ?? undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        className={cn('w-full', {
                          'border-destructive ring-0.5 ring-destructive': form.formState.errors.seoRobots,
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción SEO</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      className="h-[115px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            {/* EMPTY FOR UI */}
          </div>
          <div className="w-full lg:w-1/2 flex justify-end">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        id="active"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="active">Activo</Label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.back()}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              !page ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PageForm;
