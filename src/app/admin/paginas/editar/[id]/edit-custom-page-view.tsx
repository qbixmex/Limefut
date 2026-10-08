import type { FC } from 'react';
import { fetchPageAction, type CUSTOM_PAGE_TYPE } from '../../(actions)/fetchPageAction';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { EditCustomPageForm } from './edit-custom-page-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export type CountCharacters = {
  count: number;
  focused: boolean;
};

export const EditCustomPageView: FC<Props> = async ({ params }) => {
  const pageId = (await params).id;

  const response = await fetchPageAction(pageId);

  if (!response.page) {
    const message = `La página con el id: "${pageId}", no existe`;
    redirect(
      ROUTES.ADMIN_CUSTOM_PAGES +
      '?error=' +
      encodeURIComponent(message),
    );
  }

  const customPage = response.page as CUSTOM_PAGE_TYPE;

  return (
    <EditCustomPageForm customPage={customPage} />
  );
};
