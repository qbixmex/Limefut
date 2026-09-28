'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { editCoachSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { Coach } from '@/shared/interfaces';
import { updateCoachAction } from '../../../(actions)';
import { ROUTES } from '@/shared/constants/routes';

export const useEditCoach = (coach: Coach) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof editCoachSchema>>({
    resolver: zodResolver(editCoachSchema),
    defaultValues: {
      name: coach.name,
      email: coach.email ?? '',
      phone: coach.phone ?? '',
      age: coach.age ?? undefined,
      nationality: coach.nationality ?? '',
      description: coach.description ?? '',
      active: coach.active,
    },
  });

  const onSubmit = async (data: z.infer<typeof editCoachSchema>) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name.trim());
    if (data.email) formData.append('email', data.email.trim());
    if (data.phone) formData.append('phone', data.phone.trim());
    if (data.age) formData.append('age', String(data.age));
    if (data.nationality) formData.append('nationality', data.nationality.trim());
    if (data.description) formData.append('description', data.description.trim());

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    formData.append('active', String(data.active ?? false));

    const response = await updateCoachAction({
      formData,
      coachId: coach.id,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    route.replace(ROUTES.ADMIN_COACHES);
  };

  return {
    form,
    route,
    onSubmit,
  };
};
