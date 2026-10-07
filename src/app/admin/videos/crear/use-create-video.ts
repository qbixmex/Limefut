'use client';

import { toast } from 'sonner';
import { createVideoAction } from '../(actions)';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createVideoSchema } from '@/shared/schemas';
import { ROUTES } from '@/shared/constants/routes';
import type z from 'zod';

const createDefaultFormValues = () => ({
  title: '',
  permalink: '',
  url: '',
  platform: undefined,
  publishedDate: undefined,
  description: '',
  active: false,
});

export const useCreateVideo = () => {
  const route = useRouter();

  const form = useForm<z.infer<typeof createVideoSchema>>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: createDefaultFormValues(),
  });

  const handleRedirectBack = () => {
    form.reset(createDefaultFormValues());
    route.replace(ROUTES.ADMIN_VIDEOS);
  };

  const onSubmit = async (data: z.infer<typeof createVideoSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('publishedDate', (data.publishedDate as Date).toString());
    formData.append('description', data.description as string ?? '');
    formData.append('url', data.url ?? '');
    formData.append('platform', data.platform ?? '');
    formData.append('active', String(data.active ?? false));

    const response = await createVideoAction(formData);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
      form.reset(createDefaultFormValues());
      route.replace(ROUTES.ADMIN_VIDEOS);
    }
  };

  return { form, route, handleRedirectBack, onSubmit };
};
