'use client';

import type { FC, ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { createCategorySchema, editCategorySchema } from '@/shared/schemas';
import type { Session } from '@/lib/auth-client';
import { createCategoryAction } from '../(actions)/create-category.action';
import type { Category } from '@/shared/interfaces';
import { slugify } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { updateCategoryAction } from '../(actions)/update-category.action';

type Props = Readonly<{
  session: Session;
  category?: Category;
}>;

export const CategoryForm: FC<Props> = ({ session, category }) => {
  const route = useRouter();
  const formSchema = !category ? createCategorySchema : editCategorySchema;
  const isPermalinkEdited = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? '',
      permalink: category?.permalink ?? '',
    },
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const handleNavigateBack = () => {
    if (!category) {
      form.reset({
        name: '',
        permalink: '',
      });
    }
    route.replace(ROUTES.ADMIN_CATEGORIES);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('permalink', data.permalink as string);

    // Create Category
    if (!category) {
      const response = await createCategoryAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_CATEGORIES);
      }
      return;
    }

    if (category) {
      const response = await updateCategoryAction({
        formData,
        categoryId: category?.id,
        userRoles: session.user.roles as string[] ?? null,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_CATEGORIES);
      }
    }
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 h-full flex flex-col"
        >
          {/* Name and Permalink */}
          <div className="flex flex-col gap-5 flex-1">
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre <span className="text-amber-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={handleNameChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="permalink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enlace Permanente <span className="text-amber-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={handlePermalinkChange}
                      />
                    </FormControl>
                    <FormMessage />
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
              onClick={handleNavigateBack}
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
                !category ? 'crear' : 'actualizar'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
