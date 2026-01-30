import type { FC } from "react";

import { PageForm } from '../(components)/page-form';
import { createEmptyCustomPage } from "../(actions)/createEmptyCustomPage";
import { redirect } from "next/navigation";

export const CustomPageWrapper: FC = async () => {
  const { ok, message, pageId } = await createEmptyCustomPage();
  
  if (!ok && !pageId) {
    redirect(`/admin/paginas?error=${encodeURIComponent(message)}`);
  }

  return (
    <PageForm key={pageId} newPageId={pageId as string} />
  );
};
