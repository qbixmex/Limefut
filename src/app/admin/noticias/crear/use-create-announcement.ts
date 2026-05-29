'use client';

import { useRouter } from 'next/navigation';
import { CreateAnnouncementSchema } from '@/shared/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnnouncementAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';

export const useCreateAnnouncement = ({
  authenticatedUserId,
  authenticatedUserRoles,
} : {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof CreateAnnouncementSchema>>({
    resolver: zodResolver(CreateAnnouncementSchema),
    defaultValues: {
      title: '',
      permalink: '',
      publishedDate: undefined,
      description: '',
      content: '',
      active: false,
    },
  });

  const handleRedirectBack = () => {
    route.replace(ROUTES.ADMIN_ANNOUNCEMENTS);
  };

  const onSubmit = async (data: z.infer<typeof CreateAnnouncementSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('publishedDate', (data.publishedDate as Date).toString());
    formData.append('description', data.description as string ?? '');
    formData.append('content', data.content ?? '');
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image as File);
    }
    formData.append('active', String(data.active ?? false));

    const response = await createAnnouncementAction({
      formData,
      authenticatedUserId,
      authenticatedUserRoles,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    route.replace(ROUTES.ADMIN_ANNOUNCEMENTS);
  };

  return {
    form,
    handleRedirectBack,
    onSubmit,
  };
};
