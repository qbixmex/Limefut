'use client';

import { editTeamSchema } from '@/shared/schemas';
import { updateTeamAction } from '@/app/admin/equipos/(actions)';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants/routes';
import type { TEAM_TYPE } from '../../(actions)/fetch-team-for-edit.action';
import type z from 'zod';

export const useEditTeam = ({
  authenticatedUserId,
  authenticatedUserRoles,
  team,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  team: TEAM_TYPE;
}) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof editTeamSchema>>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: team.name,
      permalink: team.permalink,
      categoryId: team.category?.id ?? undefined,
      format: team.format,
      gender: team.gender,
      tournamentId: team.tournament?.id ?? undefined,
      country: team.country,
      state: team.state,
      city: team.city,
      coachId: team.coachId,
      emails: team.emails,
      address: team.address,
      fieldsIds: team.fieldsIds,
      active: team.active,
    },
  });

  const onSubmit = async (data: z.infer<typeof editTeamSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('permalink', data.permalink as string);
    formData.append('categoryId', data.categoryId as string);
    formData.append('format', data.format as string);
    formData.append('gender', data.gender as string);

    if (data.tournamentId) {
      formData.append('tournamentId', data.tournamentId.trim());
    }

    if (data.country) formData.append('country', data.country as string);
    if (data.state) formData.append('state', data.state as string);
    if (data.city) formData.append('city', data.city as string);

    if (data.coachId) {
      formData.append('coachId', data.coachId.trim());
    }

    if (data.emails) formData.append('emails', JSON.stringify(data.emails as string[]));

    if (data.address) {
      formData.append('address', data.address.trim());
    }

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    if (data.fieldsIds && data.fieldsIds.length > 0) {
      formData.append('fieldsIds', JSON.stringify(data.fieldsIds));
    }

    formData.append('active', String(data.active));

    const { ok, message, updatedTeam } = await updateTeamAction({
      authenticatedUserId,
      authenticatedUserRoles,
      formData,
      teamId: team.id,
    });
    if (!ok && !updatedTeam) {
      toast.error(message);
      return;
    }
    if (ok && updatedTeam && updatedTeam.tournament && updatedTeam.category) {
      route.replace(ROUTES.ADMIN_TEAMS +
        `?tournament=${updatedTeam.tournament.permalink}` +
        `&category=${updatedTeam.category.permalink}`,
      );
    }
  };

  const handleNavigateBack = () => {
    form.reset({
      name: '',
      permalink: '',
      categoryId: undefined,
      format: '',
      gender: undefined,
      tournamentId: '',
      country: '',
      state: '',
      city: '',
      coachId: '',
      emails: [],
      address: '',
      fieldsIds: [],
      active: false,
    });

    if (team && team.tournament && team.category) {
      route.replace(ROUTES.ADMIN_TEAMS +
        `?tournament=${team.tournament.permalink}` +
        `&category=${team.category.permalink}`,
      );
    } else {
      route.replace(ROUTES.ADMIN_TEAMS);
    }
  };

/*
¡ El torneo con el enlace permanente: "torneo-febrero-junio-2026-edicion-copa-del-mundo"
y categoría "null" no existe ❌ !
*/
  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
