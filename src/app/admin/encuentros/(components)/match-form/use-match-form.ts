'use client';

import { useState } from 'react';
import { createMatchSchema, editMatchSchema } from '@/shared/schemas';
import { createMatchAction } from '@/app/admin/encuentros/(actions)/create-match.action';
import { updateMatchAction } from '@/app/admin/encuentros/(actions)/update-match.action';
import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MATCH_STATUS } from '@/shared/enums';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type z from 'zod';

type Options = {
  authenticatedUserId: string | undefined;
  sessionUserRoles: string[];
  match: MatchType | null | undefined;
  week: number | undefined;
  router: AppRouterInstance;
  searchParams: URLSearchParams;
};

export const useMatchForm = (options: Options) => {
  const {
    authenticatedUserId,
    sessionUserRoles,
    match,
    router,
    searchParams,
  } = options;

  // Initialize Form
  const formSchema = !match ? createMatchSchema : editMatchSchema;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      localTeamId: match?.localTeam.id ?? '',
      localScore: match?.localScore ?? 0,
      visitorTeamId: match?.visitorTeam.id ?? '',
      visitorScore: match?.visitorScore ?? 0,
      place: match?.place ?? '',
      referee: match?.referee ?? undefined,
      matchDate: match?.matchDate ? new Date(match.matchDate) : undefined,
      status: match?.status ?? MATCH_STATUS.SCHEDULED,
      week: match?.week ?? 0,
      tournament: match?.tournament.permalink ??
        searchParams.get('tournament') ??
        undefined,
      category: match?.tournament.category ??
        searchParams.get('category') ??
        undefined,
    },
  });

  // Local States
  const [hiddenScores, setHiddenScores] = useState(match?.status === MATCH_STATUS.COMPLETED);

  // Functions
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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

    // Create match
    if (!match) {
      const response = await createMatchAction(
        formData,
        sessionUserRoles,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        router.replace(ROUTES.ADMIN_MATCHES +
          `?tournament=${response.match?.tournament.permalink}` +
          `&category=${response.match?.tournament.category}` +
          `&sort-week=${response.match?.week ?? 'unassigned'}`,
        );
      }
    }

    // Update Match
    if (match) {
      const response = await updateMatchAction({
        formData,
        matchId: match.id,
        sessionUserRoles,
        authenticatedUserId,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);

        router.replace(ROUTES.ADMIN_MATCHES +
          `?tournament=${response.match?.tournament.permalink}` +
          `&category=${response.match?.tournament.category}` +
          `&sort-week=${response.match?.week ?? 'unassigned'}`,
        );
      }
    }
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams);
    const category = params.get('category');
    const tournament = params.get('tournament');

    if (params.has('selected-week')) params.delete('selected-week');

    if (!match && tournament && category && params.size === 0) {
      // When the user wants to create a new match.
      router.replace(ROUTES.ADMIN_MATCHES +
        `?tournament=${tournament}` +
        `&category=${category}`,
      );
    } else if (match && params.size === 0) {
      // When the user wants to edit a match and didn't set filters.
      setHiddenScores(true);
      router.replace(`${ROUTES.ADMIN_MATCHES}?${params}`);
    } else if ((!match || match) && params.size > 0) {
      setHiddenScores(true);
      // When the user wants to create a new match and set filters.
      router.replace(`${ROUTES.ADMIN_MATCHES}?${params}`);
    } else {
      // For anything else
      router.replace(ROUTES.ADMIN_MATCHES);
    }
  };

  const handleFlipTeams = () => {
    const localTeamId = form.getValues('localTeamId');
    const visitorTeamId = form.getValues('visitorTeamId');

    form.setValue('localTeamId', visitorTeamId);
    form.setValue('visitorTeamId', localTeamId);
  };

  return {
    // states
    hiddenScores,
    form,
    // functions
    setHiddenScores,
    handleFlipTeams,
    handleNavigateBack,
    onSubmit,
  };
};
