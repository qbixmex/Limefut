'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { editPageSchema } from '@/shared/schemas';
import type { CUSTOM_PAGE_TYPE } from '../../(actions)/fetchPageAction';
import { updatePageAction } from '../../(actions)/updatePageAction';
import { ROUTES } from '@/shared/constants/routes';
import type { CustomPageImage } from '@/shared/interfaces/Page';

export const useEditCustomPage = (page: CUSTOM_PAGE_TYPE) => {
  const route = useRouter();
  const [isDraft, setIsDraft] = useState(false);
  const onSaveDraft = () => setIsDraft(true);
  const [contentImages, setContentImages] = useState<CustomPageImage[]>(page.images);

  const form = useForm<z.infer<typeof editPageSchema>>({
    resolver: zodResolver(editPageSchema),
    defaultValues: {
      title: page.title ?? '',
      permalink: page.permalink ?? '',
      content: page.content ?? '',
      seoTitle: page.seoTitle ?? undefined,
      seoDescription: page.seoDescription ?? undefined,
      seoRobots: page.seoRobots ?? 'noindex, nofollow',
      position: page.position ?? 0,
      status: page.status ?? 'draft',
    },
  });

  const onSubmit = async (data: z.infer<typeof editPageSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('content', data.content as string);
    formData.append('seoTitle', data.seoTitle as string);
    formData.append('seoDescription', data.seoDescription as string);
    formData.append('seoRobots', data.seoRobots as string);
    formData.append('position', String(data.position ?? 0));
    formData.append('status', data.status as string);

    const response = await updatePageAction({
      formData,
      pageId: page.id,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);

    if (!isDraft) {
      route.replace(ROUTES.ADMIN_CUSTOM_PAGES);
    }

    setIsDraft(false);
  };

  const handleNavigateBack = () => {
    route.replace(ROUTES.ADMIN_CUSTOM_PAGES);
  };

  const updateContentImage = useCallback((customPageImage: CustomPageImage) => {
    setContentImages((prev) => [...prev, customPageImage]);
  }, []);

  const removeContentImage = useCallback((resourceId: string) => {
    setContentImages((prev) => {
      return prev.filter((image) => image.resourceId !== resourceId);
    });
  }, []);

  return {
    form,
    isDraft,
    route,
    contentImages,
    handleNavigateBack,
    onSubmit,
    onSaveDraft,
    setContentImages,
    updateContentImage,
    removeContentImage,
  };
};
