'use client';

import { ROUTES } from '@/shared/constants/routes';
import type { User, ROLE_TYPE } from '@/shared/interfaces';
import { editUserSchema } from '@/shared/schemas';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateUserAction } from '../../(actions)';

export const useEditUser = (user: User) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      email: user.email,
      password: '',
      passwordConfirmation: '',
      roles: user.roles.map((role) => role as ROLE_TYPE),
      isActive: user.isActive,
    },
  });

  const onSubmit = async (data: z.infer<typeof editUserSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    if (data.username) formData.append('username', data.username);
    formData.append('email', data.email as string);
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    formData.append('password', data.password as string);
    formData.append('passwordConfirmation', data.passwordConfirmation as string);
    formData.append('roles', JSON.stringify(data.roles));
    formData.append('isActive', String(data.isActive ?? false));

    const response = await updateUserAction(formData, user.id);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
      route.replace(ROUTES.ADMIN_USERS);
    }
  };

  return {
    form,
    route,
    onSubmit,
  };
};
