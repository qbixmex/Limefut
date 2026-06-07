'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { CreatePlayoffsSchema } from '@/shared/schemas';
import { createPlayoffAction } from '@/app/admin/liguilla/(actions)/create-playoff.action';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';

const DEFAULT_FORM_VALUES = {
  tournament: '',
  category: '',
  teamsIds: [],
  startingRound: '',
};

export const useCreatePlayoffs = ({
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof CreatePlayoffsSchema>>({
    resolver: zodResolver(CreatePlayoffsSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      tournament: searchParams.get('tournament') ?? '',
      category: searchParams.get('category') ?? '',
    },
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof CreatePlayoffsSchema>) => {
    const formData = new FormData();

    formData.append('tournament', data.tournament);
    formData.append('category', data.category);
    formData.append('teamsIds', JSON.stringify(data.teamsIds));
    formData.append('startingRound', data.startingRound);

    const { ok, message } = await createPlayoffAction({
      formData,
      authenticatedUserId,
      authenticatedUserRoles,
    });

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);

    form.reset(DEFAULT_FORM_VALUES);
    router.replace(ROUTES.ADMIN_PLAYOFFS);
  };

  const handleNavigateBack = () => {
    form.reset(DEFAULT_FORM_VALUES);
    router.replace(ROUTES.ADMIN_PLAYOFFS);
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
