'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deletePlayerImageAction } from '../../(actions)/deletePlayerImageAction';

type Props = Readonly<{
  roles: string[];
  userId: string | null | undefined;
  teamId: string;
  className?: string;
}>;

export const DeletePlayerImage: FC<Props> = ({ roles, userId, teamId, className }) => {
  const onDeleteImage = async () => {
    if (!roles?.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar la imagen !');
      return;
    }

    const response = await deletePlayerImageAction({
      playerId: teamId,
      authenticatedUserId: userId,
      authenticatedUserRoles: roles,
    });

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
