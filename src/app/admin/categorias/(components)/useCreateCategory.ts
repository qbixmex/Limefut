'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createCategorySchema, editCategorySchema } from '@/shared/schemas';
import { createCategoryAction } from '../(actions)/create-category.action';
import type { Category } from '@/shared/interfaces';
import { ROUTES } from '@/shared/constants/routes';
import type z from 'zod';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | undefined;
  category?: Category;
}>;

export const useCreateCategory = ({
  authenticatedUserId,
  authenticatedUserRoles,
  category,
}: Props) => {
  const route = useRouter();
  const formSchema = !category ? createCategorySchema : editCategorySchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? '',
      permalink: category?.permalink ?? '',
    },
  });

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

    const response = await createCategoryAction({
      authenticatedUserId,
      authenticatedUserRoles,
      formData,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
      route.replace(ROUTES.ADMIN_CATEGORIES);
    }
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
