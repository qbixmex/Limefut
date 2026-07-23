'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPlayerSchema } from '@/shared/schemas';
import { createPlayerAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';
import type { Session } from '@/lib/auth-client';

type Props = Readonly<{
  session: Session;
}>;

const DEFAULT_FORM_VALUES = {
  name: '',
  email: undefined,
  phone: undefined,
  birthday: undefined,
  nationality: undefined,
  image: undefined,
  active: false,
  teamId: '',
};

export const useCreatePlayer = ({ session }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof createPlayerSchema>>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = async (data: z.infer<typeof createPlayerSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    if (data.email) formData.append('email', data.email as string);
    if (data.phone) formData.append('phone', data.phone as string);
    if (data.nationality) formData.append('nationality', data.nationality as string);
    if (data.birthday) formData.append('birthday', (data.birthday as Date).toISOString());
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    formData.append('active', String(data.active ?? false));
    formData.append('teamId', data.teamId as string);

    const { ok, message } = await createPlayerAction(
      formData,
      session?.user.roles ?? null,
    );

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    form.reset(DEFAULT_FORM_VALUES);

    const params = new URLSearchParams();
    const tournament = searchParams.get('tournament');

    if (tournament) params.set('tournament', tournament);

    router.replace(`${ROUTES.ADMIN_PLAYERS}?${params}`);
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams();
    const tournament = searchParams.get('tournament');

    if (tournament) params.set('tournament', tournament);

    form.reset(DEFAULT_FORM_VALUES);
    router.replace(`${ROUTES.ADMIN_PLAYERS}?${params}`);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
