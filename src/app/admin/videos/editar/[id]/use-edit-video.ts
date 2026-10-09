'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { editVideoSchema } from '@/shared/schemas';
import { ROUTES } from '@/shared/constants/routes';
import type z from 'zod';
import { updateVideoAction, type VIDEO_TYPE } from '../../(actions)';

export const useEditVideo = (video: VIDEO_TYPE) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof editVideoSchema>>({
    resolver: zodResolver(editVideoSchema),
    defaultValues: {
      title: video.title,
      permalink: video.permalink,
      url: video.url,
      platform: video.platform,
      publishedDate: video.publishedDate,
      description: video.description,
      active: video.active,
    },
  });

  const handleRedirectBack = () => {
    route.replace(ROUTES.ADMIN_VIDEOS);
  };

  const onSubmit = async (data: z.infer<typeof editVideoSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('publishedDate', (data.publishedDate as Date).toString());
    formData.append('description', data.description as string ?? '');
    formData.append('url', data.url ?? '');
    formData.append('platform', data.platform ?? '');
    formData.append('active', String(data.active ?? false));

    const response = await updateVideoAction({
      formData,
      videoId: video.id,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
      route.replace(ROUTES.ADMIN_VIDEOS);
    }
  };

  return { form, route, handleRedirectBack, onSubmit };
};
