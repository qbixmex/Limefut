'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deleteCoachImageAction } from '../../(actions)/deleteCoachImageAction';

type Props = Readonly<{
  roles: string[];
  coachId: string;
  className?: string;
}>;

export const DeleteCoachImage: FC<Props> = ({ roles, coachId, className }) => {
  const onDeleteImage = async () => {
    if (!roles?.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar la imagen !');
      return;
    }

    const response = await deleteCoachImageAction(coachId);

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
