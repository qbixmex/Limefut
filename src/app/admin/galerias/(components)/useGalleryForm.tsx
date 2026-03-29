'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createGallerySchema, editGallerySchema } from '@/shared/schemas';
import { createGalleryAction, updateGalleryAction } from '../(actions)';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';
import type { Gallery } from '@/shared/interfaces';
import type z from 'zod';
import { ROUTES } from '@/shared/constants/routes';

export const useGalleryForm = ({ gallery, userId, roles }: {
  gallery?: Gallery | null;
  userId: string | null;
  roles: string[] | null;
}) => {
  const route = useRouter();
  const formSchema = !gallery ? createGallerySchema : editGallerySchema;
  const isPermalinkEdited = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery?.title ?? '',
      permalink: gallery?.permalink ?? '',
      galleryDate: gallery?.galleryDate ?? new Date(),
      active: gallery?.active ?? false,
    },
  });

  useEffect(() => {
    if (!gallery) {
      form.reset({
        title: '',
        permalink: '',
        galleryDate: new Date(),
        active: false,
      });
    }
  }, [form, gallery]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('galleryDate'),
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('galleryDate',
      data.galleryDate
        ? (data.galleryDate as Date).toISOString()
        : new Date().toISOString(),
    );

    formData.append('active', String(data.active ?? false));

    // Create gallery
    if (!gallery) {
      const response = await createGalleryAction(
        formData,
        roles,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset({
          title: '',
          permalink: '',
          galleryDate: new Date(),
          active: false,
        });
        route.replace(`/admin/galerias/${response.gallery?.id}`);
        return;
      }
      return;
    }

    if (gallery) {
      const response = await updateGalleryAction({
        formData,
        userRoles: roles!,
        authenticatedUserId: userId,
        galleryId: gallery.id as string,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset({
          title: '',
          permalink: '',
          galleryDate: new Date(),
          active: false,
        });
        route.replace(`/admin/galerias/${response.gallery?.id}`);
      }
    }
  };

  const handleCancel = () => {
    route.replace(ROUTES.ADMIN_GALLERIES);
  };

  return {
    route,
    form,
    openCalendar,
    selectedDate,
    setSelectedDate,
    setOpenCalendar,
    handleTitleChange,
    handlePermalinkChange,
    handleCancel,
    onSubmit,
  };
};
