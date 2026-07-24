'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPlayerSchema } from '@/shared/schemas';
import { updatePlayerAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import type z from 'zod';

type TeamType = {
  id: string;
  name: string;
};

type PlayerType = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: Date | null;
  nationality: string | null;
  active: boolean;
  team: TeamType | null;
};

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  player: PlayerType;
}>;

export const useEditPlayer = ({ authenticatedUserId, authenticatedUserRoles, player }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof editPlayerSchema>>({
    resolver: zodResolver(editPlayerSchema),
    defaultValues: {
      name: player.name,
      email: player.email ?? undefined,
      phone: player.phone ?? undefined,
      birthday: player.birthday ?? undefined,
      nationality: player.nationality ?? undefined,
      teamId: player.team?.id ?? '',
      active: player.active,
    },
  });

  const onSubmit = async (data: z.infer<typeof editPlayerSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    if (data.email) formData.append('email', data.email as string);
    if (data.phone) formData.append('phone', data.phone as string);
    if (data.nationality) formData.append('nationality', data.nationality as string);
    if (data.birthday) formData.append('birthday', (data.birthday as Date).toISOString());
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    formData.append('active', String(data.active ?? false));
    formData.append('teamId', data.teamId as string);

    const { ok, message } = await updatePlayerAction({
      formData,
      playerId: player.id,
      authenticatedUserRoles,
      authenticatedUserId,
    });

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);

    const params = new URLSearchParams();
    const tournament = searchParams.get('tournament');
    const category = searchParams.get('category');

    if (tournament) params.set('tournament', tournament);
    if (category) params.set('category', category);
    if (player.team) params.set('team', player.team.id);

    router.replace(`${ROUTES.ADMIN_PLAYERS}?${params}`);
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams();
    const tournament = searchParams.get('tournament');
    const category = searchParams.get('category');

    if (tournament) params.set('tournament', tournament);
    if (category) params.set('category', category);
    if (player.team) params.set('team', player.team.id);

    router.replace(`${ROUTES.ADMIN_PLAYERS}?${params}`);
  };

  return {
    form,
    onSubmit,
    handleNavigateBack,
  };
};
