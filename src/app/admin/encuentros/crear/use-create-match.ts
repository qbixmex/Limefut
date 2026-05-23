'use client';

import { useForm } from 'react-hook-form';
import { createMatchSchema } from '@/shared/schemas';
import { MATCH_STATUS } from '@/shared/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { createMatchAction } from '@/app/admin/encuentros/(actions)/create-match.action';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';

export const useCreateMatch = ({
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      localTeamId: '',
      localScore: 0,
      visitorTeamId: '',
      visitorScore: 0,
      place: '',
      referee: undefined,
      matchDate: undefined,
      status: MATCH_STATUS.SCHEDULED,
      week: 0,
      tournament: searchParams.get('tournament') ?? undefined,
      category: searchParams.get('category') ?? undefined,
    },
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof createMatchSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId);
    formData.append('localScore', data.localScore.toString());
    formData.append('visitorTeamId', data.visitorTeamId);
    formData.append('visitorScore', data.visitorScore.toString());
    if (data.place) formData.append('place', data.place);
    if (data.referee) formData.append('referee', data.referee);
    if (data.matchDate) formData.append('matchDate', data.matchDate.toISOString());
    formData.append('status', data.status);
    formData.append('week', data.week.toString());
    formData.append('tournament', data.tournament);
    formData.append('category', data.category);

    const response = await createMatchAction({
      formData,
      authenticatedUserId,
      authenticatedUserRoles,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);

    router.replace(ROUTES.ADMIN_MATCHES +
      `?tournament=${response.match?.tournament.permalink}` +
      `&category=${response.match?.tournament.category}` +
      `&sort-week=${response.match?.week ?? 'unassigned'}`,
    );
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams);

    if (params.has('selected-week')) params.delete('selected-week');

    if (params.has('tournament') && params.has('category')) {
      router.replace(ROUTES.ADMIN_MATCHES +
        `?tournament=${params.get('tournament')}` +
        `&category=${params.get('category')}`,
      );
    } else if (params.size > 0) {
      router.replace(`${ROUTES.ADMIN_MATCHES}?${params}`);
    } else {
      router.replace(ROUTES.ADMIN_MATCHES);
    }
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
