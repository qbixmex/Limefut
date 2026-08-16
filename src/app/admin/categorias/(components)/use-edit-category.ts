'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { editCategorySchema } from '@/shared/schemas';
import type { Category } from '@/shared/interfaces';
import { ROUTES } from '@/shared/constants/routes';
import { updateCategoryAction } from '../(actions)/update-category.action';
import type z from 'zod';

type Props = Readonly<{
  category: Category;
}>;

export const useEditCategory = ({ category }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
      permalink: category.permalink,
    },
  });

  const onSubmit = async (data: z.infer<typeof editCategorySchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('permalink', (data.permalink as string).trim());

    const { ok, message } = await updateCategoryAction({
      formData,
      categoryId: category.id,
    });

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    router.replace(ROUTES.ADMIN_CATEGORIES);
  };

  const handleNavigateBack = () => {
    router.replace(ROUTES.ADMIN_CATEGORIES);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
