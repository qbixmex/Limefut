'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditPlayoffsMatchSchema } from '@/shared/schemas';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';
import type { MATCH_TYPE } from '../../(actions)/fetch-match-for-edit.action';
import { updatePlayoffMatchAction } from '../../(actions)/update-playoff-match.action';

export const useEditPlayoffsMatch = ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
  match,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
  match: MATCH_TYPE;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof EditPlayoffsMatchSchema>>({
    resolver: zodResolver(EditPlayoffsMatchSchema),
    defaultValues: {
      localTeamId: match.localId,
      visitorTeamId: match.visitorId,
      group: match.group,
      localTeamScore: match.localScore ?? 0,
      visitorTeamScore: match.visitorScore ?? 0,
      matchDate: match.matchDate ?? new Date(),
      status: match.status,
      referee: match.referee ?? '',
      remarks: match.remarks ?? '',
      fieldId: match.fieldId ?? '',
      round: match.round,
    },
  });

  const onSubmit = async (data: z.infer<typeof EditPlayoffsMatchSchema>) => {
    const formData = new FormData();

    if (data.localTeamId) formData.append('localTeamId', data.localTeamId);
    if (data.visitorTeamId) formData.append('visitorTeamId', data.visitorTeamId);
    if (data.fieldId) formData.append('fieldId', data.fieldId);
    if (data.referee) formData.append('referee', data.referee);
    if (data.remarks) formData.append('remarks', data.remarks);
    if (data.localTeamScore) formData.append('localTeamScore', data.localTeamScore.toString());
    if (data.visitorTeamScore) formData.append('visitorTeamScore', data.visitorTeamScore.toString());
    if (data.matchDate) formData.append('matchDate', data.matchDate.toString());
    if (data.round) formData.append('round', data.round);
    if (data.group) formData.append('group', data.group);
    if (data.status) formData.append('status', data.status);

    const { ok, message } = await updatePlayoffMatchAction({
      authenticatedUserId,
      authenticatedUserRoles,
      matchId: match.id,
      formData,
    });

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    router.replace(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  };

  const handleNavigateBack = () => {
    router.replace(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
