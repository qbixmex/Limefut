import { createTeamSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import {
  createTeamAction,
  addTeamToStandingsAction,
} from '@/app/admin/equipos/(actions)';
import type z from 'zod';

const FORM_DEFAULT_VALUES = {
  name: '',
  permalink: '',
  format: '',
  gender: undefined,
  country: '',
  state: '',
  city: '',
  coachId: '',
  emails: [],
  address: '',
  fieldsIds: [],
  active: false,
  categoryId: '',
  tournamentId: '',
};

export const useCreateTeam = ({
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const onSubmit = async (data: z.infer<typeof createTeamSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name.trim());
    formData.append('permalink', data.permalink);
    formData.append('categoryId', data.categoryId.trim());
    formData.append('format', data.format.trim());
    formData.append('gender', data.gender.trim());

    if (data.tournamentId) {
      formData.append('tournamentId', data.tournamentId.trim());
    }

    if (data.country) formData.append('country', data.country.trim());
    if (data.state) formData.append('state', data.state.trim());
    if (data.city) formData.append('city', data.city.trim());

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

    // Create team
    const { ok, message, team } = await createTeamAction({
      formData,
      authenticatedUserId,
      authenticatedUserRoles,
    });

    if (!ok && !team) {
      toast.error(message);
      return;
    }

    if (data.tournamentId && team?.id) {
      await addTeamToStandingsAction({
        tournamentId: data.tournamentId,
        teamId: team.id,
        userRoles: authenticatedUserRoles,
      });
    }

    if (ok) {
      form.reset(FORM_DEFAULT_VALUES);
      toast.success(message);

      if (team && team.tournament && team.category) {
        route.replace(ROUTES.ADMIN_TEAMS +
          `?tournament=${team.tournament.permalink}` +
          `&category=${team.category.permalink}`,
        );
      } else {
        route.replace(ROUTES.ADMIN_TEAMS);
      }
    }
  };

  const handleNavigateBack = () => {
    form.reset(FORM_DEFAULT_VALUES);
    if (searchParams.has('tournament') && searchParams.has('category')) {
      route.replace(
        ROUTES.ADMIN_TEAMS +
        `?tournament=${searchParams.get('tournament')}` +
        `&category=${searchParams.get('category')}`,
      );
    } else {
      route.replace(ROUTES.ADMIN_TEAMS);
    }
  };

  return {
    form,
    handleNavigateBack,
    onSubmit,
  };
};
