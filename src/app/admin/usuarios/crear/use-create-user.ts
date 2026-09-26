'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/shared/schemas';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { createUserAction } from '../(actions)';

const DEFAULT_FORM_VALUES = {
  name: '',
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  roles: [],
  isActive: false,
};

export const useCreateUser = () => {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
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

    const result = await createUserAction(formData);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    if (result.ok) {
      toast.success(result.message);
      form.reset(DEFAULT_FORM_VALUES);
      route.replace(ROUTES.ADMIN_USERS);
    }
  };

  return {
    form,
    showPassword,
    showPasswordConfirmation,
    route,
    onSubmit,
    setShowPassword,
    setShowPasswordConfirmation,
  };
};
