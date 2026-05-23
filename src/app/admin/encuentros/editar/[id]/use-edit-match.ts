'use client';

import { useState } from 'react';
import { updateMatchAction } from '@/app/admin/encuentros/(actions)/update-match.action';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { editMatchSchema } from '@/shared/schemas';
import { MATCH_STATUS } from '@/shared/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import type z from 'zod';

type Options = {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  match: MATCH_TYPE;
};

export const useEditMatch = (options: Options) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    authenticatedUserId,
    authenticatedUserRoles,
    match,
  } = options;

  const [hiddenScores, setHiddenScores] = useState(match.status === MATCH_STATUS.COMPLETED);

  // Initialize Form
  const form = useForm<z.infer<typeof editMatchSchema>>({
    resolver: zodResolver(editMatchSchema),
    defaultValues: {
      localTeamId: match.localTeam.id,
      localScore: match.localScore,
      visitorTeamId: match.visitorTeam.id,
      visitorScore: match.visitorScore,
      place: match.place ?? '',
      referee: match.referee ?? '',
      matchDate: match.matchDate ?? undefined,
      status: match.status,
      week: match.week ?? 0,
      tournament:
        match.tournament.permalink ??
        searchParams.get('tournament'),
      category:
        match.tournament.category ??
        searchParams.get('category'),
    },
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof editMatchSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId as string);
    formData.append('localScore', (data.localScore as number).toString());
    formData.append('visitorTeamId', data.visitorTeamId as string);
    formData.append('visitorScore', (data.visitorScore as number).toString());
    if (data.place) formData.append('place', data.place as string);
    if (data.referee) formData.append('referee', data.referee as string);
    if (data.matchDate) formData.append('matchDate', (data.matchDate as Date).toISOString());
    formData.append('status', data.status as string);
    formData.append('week', String(data.week ?? '0'));
    formData.append('tournament', data.tournament as string);
    formData.append('category', data.category as string);

    const response = await updateMatchAction({
      formData,
      matchId: match.id,
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

    setHiddenScores(true);

    if (match && params.size > 0) {
      setHiddenScores(true);
      router.replace(`${ROUTES.ADMIN_MATCHES}?${params}`);
    } else {
      router.replace(ROUTES.ADMIN_MATCHES);
    }
  };

  return {
    form,
    hiddenScores,
    setHiddenScores,
    handleNavigateBack,
    onSubmit,
  };
};
