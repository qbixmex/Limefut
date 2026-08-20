'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deleteTeamImageAction } from '../../(actions)/deleteTeamImageAction';

type Props = Readonly<{
  teamId: string;
  className?: string;
}>;

export const DeleteTeamImage: FC<Props> = ({ teamId, className }) => {
  const onDeleteImage = async () => {
    const response = await deleteTeamImageAction(teamId);

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
