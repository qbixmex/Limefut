'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { createGallerySchema } from '@/shared/schemas';
import { createGalleryAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';

const createDefaultFormValues = () => ({
  title: '',
  permalink: '',
  galleryDate: new Date(),
  active: false,
});

export const useCreateGallery = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createGallerySchema>>({
    resolver: zodResolver(createGallerySchema),
    defaultValues: createDefaultFormValues(),
  });

  const onSubmit = async (data: z.infer<typeof createGallerySchema>) => {
    const formData = new FormData();

    formData.append('title', (data.title as string).trim());
    formData.append('permalink', (data.permalink as string).trim());
    formData.append(
      'galleryDate',
      data.galleryDate
        ? (data.galleryDate as Date).toISOString()
        : new Date().toISOString(),
    );
    formData.append('active', String(data.active ?? false));

    const response = await createGalleryAction(formData);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_GALLERIES_SHOW(response.gallery?.id as string));
  };

  const handleNavigateBack = () => {
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_GALLERIES);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
