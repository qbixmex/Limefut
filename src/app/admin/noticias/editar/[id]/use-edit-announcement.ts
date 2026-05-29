'use client';

import { useRouter } from 'next/navigation';
import { EditAnnouncementSchema } from '@/shared/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { updateAnnouncementAction } from '../../(actions)';
import type { ANNOUNCEMENT_TYPE } from '../../(actions)/fetchAnnouncementAction';

export const useEditAnnouncement = ({
  announcement,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  announcement: ANNOUNCEMENT_TYPE;
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof EditAnnouncementSchema>>({
    resolver: zodResolver(EditAnnouncementSchema),
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

  const onSubmit = async (data: z.infer<typeof EditAnnouncementSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('publishedDate', (data.publishedDate as Date).toString());
    formData.append('description', data.description as string ?? '');
    formData.append('content', data.content ?? '');
    formData.append('active', String(data.active ?? false));
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image as File);
    }

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
