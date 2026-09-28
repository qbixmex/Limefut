'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { createFieldSchema } from '@/shared/schemas';
import { createFieldAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';

const createDefaultFormValues = () => ({
  name: '',
  permalink: '',
  city: '',
  state: '',
  country: '',
  address: '',
  map: '',
});

export const useCreateField = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createFieldSchema>>({
    resolver: zodResolver(createFieldSchema),
    defaultValues: createDefaultFormValues(),
  });

  const onSubmit = async (data: z.infer<typeof createFieldSchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('permalink', data.permalink as string);
    if (data.city) formData.append('city', data.city.trim());
    if (data.state) formData.append('state', data.state.trim());
    if (data.country) formData.append('country', data.country.trim());
    if (data.address) formData.append('address', data.address.trim());
    if (data.map) formData.append('map', data.map.trim());

    const response = await createFieldAction(formData);

    if (!response.ok) {
      if (response.message.includes('enlace permanente')) {
        form.setError('permalink', { message: 'Enlace permanente duplicado' });
      }
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_FIELDS);
  };

  const handleNavigateBack = () => {
    form.reset(createDefaultFormValues());
    router.replace(ROUTES.ADMIN_FIELDS);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
