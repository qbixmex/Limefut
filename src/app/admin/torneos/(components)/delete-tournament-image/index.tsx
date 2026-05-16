'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deleteTournamentImageAction } from '../../(actions)';

type Props = Readonly<{
  roles: string[];
  teamId: string;
  className?: string;
}>;

export const DeleteTournamentImage: FC<Props> = ({ roles, teamId, className }) => {
  const onDeleteImage = async () => {
    if (!roles?.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar la imagen !');
      return;
    }

    const response = await deleteTournamentImageAction(teamId);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return (
    <DeleteImage
      onDeleteImage={onDeleteImage}
      className={className}
    />
  );
};
