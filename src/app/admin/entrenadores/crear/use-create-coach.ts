'use client';

import { createCoachSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createCoachAction } from '../(actions)';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants/routes';
import type z from 'zod';

const DEFAULT_FORM_VALUES = {
  name: '',
  email: '',
  phone: '',
  age: undefined,
  nationality: '',
  description: '',
  active: false,
};

export const useCreateCoach = () => {
  const route = useRouter();

  const form = useForm<z.infer<typeof createCoachSchema>>({
    resolver: zodResolver(createCoachSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = async (data: z.infer<typeof createCoachSchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('email', (data.email as string).trim());

    if (data.phone) formData.append('phone', (data.phone as string).trim());
    if (data.age) formData.append('age', String(data.age));
    if (data.nationality) formData.append('nationality', (data.nationality as string).trim());
    if (data.description) formData.append('description', (data.description as string).trim());

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    formData.append('active', String(data.active ?? false));

    const response = await createCoachAction(formData);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset(DEFAULT_FORM_VALUES);
    route.replace(ROUTES.ADMIN_COACHES);
  };

  return {
    route,
    form,
    onSubmit,
  };
};
