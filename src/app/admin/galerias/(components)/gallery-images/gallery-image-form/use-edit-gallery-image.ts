'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { editGalleryImageSchema } from '@/shared/schemas';
import { updateGalleryImageAction } from '@/app/admin/galerias/(actions)';

type GalleryImageInput = Readonly<{
  id: string;
  title: string;
  active: boolean;
  position: number;
}>;

type Props = Readonly<{
  galleryImage: GalleryImageInput;
  onSuccess: () => void;
}>;

export const useEditGalleryImage = ({ galleryImage, onSuccess }: Props) => {
  const form = useForm<z.infer<typeof editGalleryImageSchema>>({
    resolver: zodResolver(editGalleryImageSchema),
    defaultValues: {
      title: galleryImage.title,
      active: galleryImage.active,
      position: galleryImage.position,
    },
  });

  const onSubmit = async (data: z.infer<typeof editGalleryImageSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    if (data.active) {
      formData.append('active', String(data.active));
    }

    formData.append('position', String(data.position));

    const response = await updateGalleryImageAction({
      formData,
      galleryImageId: galleryImage.id,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset();
    onSuccess();
  };

  return { form, onSubmit };
};
