'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deletePlayerImageAction } from '../../(actions)/deletePlayerImageAction';

type Props = Readonly<{
  teamId: string;
  className?: string;
}>;

export const DeletePlayerImage: FC<Props> = ({ teamId, className }) => {
  const onDeleteImage = async () => {
    const response = await deletePlayerImageAction({
      playerId: teamId,
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
