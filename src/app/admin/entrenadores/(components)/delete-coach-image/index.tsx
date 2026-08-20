'use client';

import type { FC } from 'react';
import { DeleteImage } from '@/shared/components/delete-image';
import { toast } from 'sonner';
import { deleteCoachImageAction } from '../../(actions)/deleteCoachImageAction';

type Props = Readonly<{
  coachId: string;
  className?: string;
}>;

export const DeleteCoachImage: FC<Props> = ({ coachId, className }) => {
  const onDeleteImage = async () => {
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
