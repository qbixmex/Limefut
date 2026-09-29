'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { createHeroBannerSchema } from '@/shared/schemas';
import { createHeroBannerAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';

const createDefaultFormValues = () => ({
  title: '',
  description: '',
  image: undefined as unknown as File,
  dataAlignment: 'left',
  showData: false,
  position: 0,
  active: false,
});

export const useCreateBanner = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createHeroBannerSchema>>({
    resolver: zodResolver(createHeroBannerSchema),
    defaultValues: createDefaultFormValues(),
  });

  const onSubmit = async (data: z.infer<typeof createHeroBannerSchema>) => {
    const formData = new FormData();

    formData.append('title', (data.title as string).trim());
    formData.append('description', (data.description as string).trim());
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    formData.append('dataAlignment', data.dataAlignment as string);
    formData.append('showData', String(data.showData ?? false));
    formData.append('position', String(data.position ?? 0));
    formData.append('active', String(data.active ?? false));

    const response = await createHeroBannerAction(formData);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_BANNERS_SHOW(response.heroBanner?.id as string));
  };

  const handleNavigateBack = () => {
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_BANNERS);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
