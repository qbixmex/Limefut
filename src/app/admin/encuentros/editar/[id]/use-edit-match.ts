'use client';

import { useState } from 'react';
import type { MATCH_TYPE as MATCH_UPDATED_TYPE } from '@/app/admin/encuentros/(actions)/update-match.action';
import { updateMatchAction } from '@/app/admin/encuentros/(actions)/update-match.action';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { editMatchSchema } from '@/shared/schemas';
import { useRouter, useSearchParams } from 'next/navigation';
import type z from 'zod';
import { MATCH_STATUS } from '@/shared/enums';

type Options = {
  match: MATCH_TYPE;
};

export const useEditMatch = (options: Options) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    match,
  } = options;

  const [hiddenScores, setHiddenScores] = useState(() => {
    if (match) {
      switch (match.status) {
        case MATCH_STATUS.SCHEDULED: {
          return false;
        }
        case MATCH_STATUS.IN_PROGRESS: {
          return false;
        }
        case MATCH_STATUS.POST_POSED: {
          return true;
        }
        case MATCH_STATUS.COMPLETED: {
          return true;
        }
        case MATCH_STATUS.CANCELED: {
          return true;
        }
        default:
          return false;
      }
    }
    return false;
  });

  const [isModifyingScores, setIsModifyingScores] = useState(false);

  // Initialize Form
  const form = useForm<z.infer<typeof editMatchSchema>>({
    resolver: zodResolver(editMatchSchema),
    defaultValues: {
      localTeamId: match.localTeam.id,
      localScore: match.localScore,
      visitorTeamId: match.visitorTeam.id,
      visitorScore: match.visitorScore,
      fieldId: match.field?.id,
      referee: match.referee ?? '',
      matchDate: match.matchDate ?? undefined,
      status: match.status,
      week: match.week ?? 0,
      tournament:
        match.tournament.permalink ??
        searchParams.get('tournament'),
      category:
        match.category?.permalink ??
        searchParams.get('category') ??
        undefined,
    },
  });

  // Functions
  const onSubmit = async (data: z.infer<typeof editMatchSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId as string);
    formData.append('localScore', (data.localScore as number).toString());
    formData.append('visitorTeamId', data.visitorTeamId as string);
    formData.append('visitorScore', (data.visitorScore as number).toString());
    if (data.fieldId) formData.append('fieldId', data.fieldId);
    if (data.referee) formData.append('referee', data.referee as string);
    if (data.matchDate) formData.append('matchDate', (data.matchDate as Date).toISOString());
    formData.append('status', data.status as string);
    formData.append('week', String(data.week ?? '0'));
    formData.append('tournament', data.tournament as string);
    formData.append('category', data.category as string);

    const response = await updateMatchAction({
      formData,
      matchId: match.id,
    });

    const updatedMatch = response.match as MATCH_UPDATED_TYPE;

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (updatedMatch.status === MATCH_STATUS.COMPLETED) {
      setHiddenScores(true);
      setIsModifyingScores(false);
    } else {
      setHiddenScores(false);
    }

    toast.success(response.message);

    router.replace(ROUTES.ADMIN_MATCHES +
      `?tournament=${updatedMatch.tournament.permalink}` +
      `&category=${updatedMatch.category?.permalink}` +
      `&sort-week=${updatedMatch.week ?? 'unassigned'}`,
    );
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams);

    if (match.status === MATCH_STATUS.COMPLETED) {
      setIsModifyingScores(false);
      setHiddenScores(true);
    } else {
      setHiddenScores(false);
    }

    if (params.has('selected-week')) params.delete('selected-week');

    if (match && params.size > 0) {
      router.replace(`${ROUTES.ADMIN_MATCHES}?${params}`);
    } else {
      router.replace(ROUTES.ADMIN_MATCHES);
    }
  };

  return {
    form,
    hiddenScores,
    isModifyingScores,
    setIsModifyingScores,
    setHiddenScores,
    handleNavigateBack,
    onSubmit,
  };
};
