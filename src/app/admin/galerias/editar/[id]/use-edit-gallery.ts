'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { editGallerySchema } from '@/shared/schemas';
import { updateGalleryAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import type { Gallery } from '@/shared/interfaces';

type Props = Readonly<{ gallery: Gallery }>;

export const useEditGallery = ({ gallery }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof editGallerySchema>>({
    resolver: zodResolver(editGallerySchema),
    defaultValues: {
      title: gallery.title,
      permalink: gallery.permalink,
      galleryDate: gallery.galleryDate,
      active: gallery.active,
    },
  });

  const onSubmit = async (data: z.infer<typeof editGallerySchema>) => {
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

    const response = await updateGalleryAction({
      formData,
      galleryId: gallery.id as string,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.replace(ROUTES.ADMIN_GALLERIES_SHOW(gallery.id as string));
  };

  const handleNavigateBack = () => {
    router.replace(ROUTES.ADMIN_GALLERIES);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
