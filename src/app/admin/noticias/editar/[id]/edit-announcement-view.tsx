import type { FC } from 'react';
import type { ANNOUNCEMENT_TYPE } from '../../(actions)';
import { fetchAnnouncementAction } from '../../(actions)';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { EditAnnouncementForm } from './edit-announcement.form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditAnnouncementView: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const { ok, announcement } = await fetchAnnouncementAction(id);

  if (!ok) {
    const message = 'La noticia no existe';
    redirect(`${ROUTES.ADMIN_ANNOUNCEMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditAnnouncementForm announcement={announcement as ANNOUNCEMENT_TYPE} />
  );
};
