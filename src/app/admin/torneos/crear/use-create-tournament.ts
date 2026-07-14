'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTournamentSchema } from '@/shared/schemas';
import { createTournamentAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';

const DEFAULT_FORM_VALUES = {
  name: '',
  permalink: '',
  categoriesIds: [],
  country: undefined,
  cities: undefined,
  season: undefined,
  description: undefined,
  startDate: undefined,
  endDate: undefined,
  active: false,
};

export const useCreateTournament = ({
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createTournamentSchema>>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof createTournamentSchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('permalink', (data.permalink as string).trim());

    if (data.cities && data.cities.length > 0) {
      formData.append('cities', JSON.stringify(data.cities));
    }
    if (data.categoriesIds && data.categoriesIds.length > 0) {
      formData.append('categoriesIds', JSON.stringify(data.categoriesIds));
    }
    if (data.country) formData.append('country', (data.country as string).trim());
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    if (data.description) {
      formData.append('description', (data.description as string).trim());
    }
    if (data.season) {
      formData.append('season', (data.season as string).trim());
    }
    formData.append('startDate',
      data.startDate
        ? (data.startDate as Date).toISOString()
        : new Date().toISOString(),
    );
    formData.append('endDate',
      data.endDate
        ? (data.endDate as Date).toISOString()
        : new Date().toISOString(),
    );
    formData.append('active', String(data.active ?? false));

    const { ok, message } = await createTournamentAction({
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
    router.replace(ROUTES.ADMIN_TOURNAMENTS);
  };

  const handleNavigateBack = () => {
    form.reset(DEFAULT_FORM_VALUES);
    router.replace(ROUTES.ADMIN_TOURNAMENTS);
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
