import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { fetchVideoAction, type VIDEO_TYPE } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { EditVideoForm } from './edit-video-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditVideoView: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await fetchVideoAction(id);

  if (!response.ok || !response.video) {
    const message = `El video con el id: [${id}] no existe`;
    redirect(
      ROUTES.ADMIN_VIDEOS +
      '?error=' +
      encodeURIComponent(message),
    );
  }

  return (
    <EditVideoForm
      video={response.video as VIDEO_TYPE}
    />
  );
};
