'use client';

import { useForm } from 'react-hook-form';
import { createMatchSchema } from '@/shared/schemas';
import { MATCH_STATUS } from '@/shared/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/create-match.action';
import { createMatchAction } from '@/app/admin/encuentros/(actions)/create-match.action';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';

const FORM_DEFAULT_VALUES = {
  localTeamId: '',
  localScore: 0,
  visitorTeamId: '',
  visitorScore: 0,
  place: '',
  referee: undefined,
  matchDate: undefined,
  status: undefined,
  week: 0,
  tournament: undefined,
  category: undefined,
};

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
      ...FORM_DEFAULT_VALUES,
      status: MATCH_STATUS.SCHEDULED,
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

    form.reset(FORM_DEFAULT_VALUES);
    toast.success(response.message);

    const match = response.match as MATCH_TYPE;

    router.replace(ROUTES.ADMIN_MATCHES +
      `?tournament=${match.tournament.permalink}` +
      `&category=${match.category}` +
      `&sort-week=${match.week ?? 'unassigned'}`,
    );
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams);

    form.reset(FORM_DEFAULT_VALUES);

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
