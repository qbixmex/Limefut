'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { editHeroBannerSchema } from '@/shared/schemas';
import { updateHeroBannerAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import type { HeroBanner } from '@/shared/interfaces';
import type { ALIGNMENT_TYPE } from '@/shared/enums';

type Props = Readonly<{ heroBanner: HeroBanner }>;

export const useEditBanner = ({ heroBanner }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof editHeroBannerSchema>>({
    resolver: zodResolver(editHeroBannerSchema),
    defaultValues: {
      title: heroBanner.title,
      description: heroBanner.description,
      dataAlignment: heroBanner.dataAlignment as ALIGNMENT_TYPE,
      position: heroBanner.position,
      showData: heroBanner.showData,
      active: heroBanner.active,
    },
  });

  const onSubmit = async (data: z.infer<typeof editHeroBannerSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('description', data.description as string);
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    formData.append('dataAlignment', data.dataAlignment as string);
    formData.append('showData', String(data.showData ?? false));
    formData.append('position', String(data.position ?? 0));
    formData.append('active', String(data.active ?? false));

    const response = await updateHeroBannerAction({
      formData,
      heroBannerId: heroBanner.id,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.replace(ROUTES.ADMIN_BANNERS_SHOW(heroBanner.id));
  };

  const handleNavigateBack = () => {
    router.replace(ROUTES.ADMIN_BANNERS);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
