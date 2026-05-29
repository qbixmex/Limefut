'use client';

import { useRouter } from 'next/navigation';
import { CreateAnnouncementSchema } from '@/shared/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { updateAnnouncementAction } from '../../(actions)';
import type { Announcement } from '@/shared/interfaces';

export const useEditAnnouncement = ({
  announcement,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  announcement: Announcement;
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof CreateAnnouncementSchema>>({
    resolver: zodResolver(CreateAnnouncementSchema),
    defaultValues: {
      title: announcement.title,
      permalink: announcement.permalink,
      publishedDate: announcement.publishedDate,
      description: announcement.description,
      content: announcement.content,
      active: announcement.active,
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
    formData.append('active', String(data.active ?? false));

    const response = await updateAnnouncementAction({
      formData,
      announcementId: announcement.id as string,
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
