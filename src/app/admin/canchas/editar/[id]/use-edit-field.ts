'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import { editFieldSchema } from '@/shared/schemas';
import { updateFieldAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import type { Field } from '@/shared/interfaces';

type Props = Readonly<{ field: Field }>;

export const useEditField = ({ field }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof editFieldSchema>>({
    resolver: zodResolver(editFieldSchema),
    defaultValues: {
      name: field.name,
      permalink: field.permalink,
      city: field.city ?? '',
      state: field.state ?? '',
      country: field.country ?? '',
      address: field.address ?? '',
      map: field.map ?? '',
    },
  });

  const onSubmit = async (data: z.infer<typeof editFieldSchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('permalink', data.permalink as string);

    if (data.city) formData.append('city', data.city.trim());
    if (data.state) formData.append('state', data.state.trim());
    if (data.country) formData.append('country', data.country.trim());
    if (data.address) formData.append('address', data.address.trim());
    if (data.map) formData.append('map', data.map.trim());

    const response = await updateFieldAction({
      formData,
      fieldId: field.id as string,
    });

    if (!response.ok) {
      if (response.message.includes('enlace permanente')) {
        form.setError('permalink', { message: 'Enlace permanente duplicado' });
      }
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.replace(ROUTES.ADMIN_FIELDS);
  };

  const handleNavigateBack = () => {
    router.replace(ROUTES.ADMIN_FIELDS);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
