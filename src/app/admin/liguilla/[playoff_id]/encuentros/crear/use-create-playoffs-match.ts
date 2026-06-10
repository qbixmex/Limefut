'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';
import { createPlayoffMatchAction } from '../../../[playoff_id]/encuentros/(actions)/create-playoff-match.action';

export const useCreatePlayoffsMatch = ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CreatePlayoffsMatchSchema>>({
    resolver: zodResolver(CreatePlayoffsMatchSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = async (data: z.infer<typeof CreatePlayoffsMatchSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId);
    formData.append('visitorTeamId', data.visitorTeamId);
    formData.append('fieldId', data.fieldId);
    if (data.referee) formData.append('referee', data.referee);
    if (data.remarks) formData.append('remarks', data.remarks);
    formData.append('localTeamScore', data.localTeamScore.toString());
    formData.append('visitorTeamScore', data.visitorTeamScore.toString());
    formData.append('matchDate', data.matchDate.toString());
    formData.append('round', data.round);
    formData.append('group', data.group);
    formData.append('status', data.status);

    const { ok, message } = await createPlayoffMatchAction({
      authenticatedUserId,
      authenticatedUserRoles,
      playoffId,
      formData,
    });

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);

    form.reset(DEFAULT_FORM_VALUES);
    router.replace(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  };

  const handleNavigateBack = () => {
    form.reset(DEFAULT_FORM_VALUES);
    router.replace(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};

const initialDate = new Date();
initialDate.setHours(8, 0, 0, 0);

const DEFAULT_FORM_VALUES = {
  group: '',
  localTeamScore: 0,
  visitorTeamScore: 0,
  matchDate: initialDate,
  status: undefined,
  referee: '',
  remarks: '',
  localTeamId: '',
  visitorTeamId: '',
  fieldId: '',
};
