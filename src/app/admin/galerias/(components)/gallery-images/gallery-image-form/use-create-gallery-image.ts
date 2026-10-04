'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createGalleryImageSchema } from '@/shared/schemas';
import { createGalleryImageAction } from '@/app/admin/galerias/(actions)';
import type z from 'zod';

type Props = Readonly<{
  galleryId: string;
  imagesQuantity: number;
  onSuccess: () => void;
}>;

export const useCreateGalleryImage = ({
  galleryId,
  imagesQuantity,
  onSuccess,
}: Props) => {
  const createDefaultFormValues = () => ({
    title: '',
    active: false,
    position: imagesQuantity + 1,
  });

  const form = useForm<z.infer<typeof createGalleryImageSchema>>({
    resolver: zodResolver(createGalleryImageSchema),
    defaultValues: createDefaultFormValues(),
  });

  const onSubmit = async (data: z.infer<typeof createGalleryImageSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    if (data.active) {
      formData.append('active', String(data.active));
    }

    formData.append('position', String(data.position));

    const response = await createGalleryImageAction({
      galleryId,
      formData,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset(createDefaultFormValues());
    onSuccess();
  };

  return {
    form,
    onSubmit,
  };
};
