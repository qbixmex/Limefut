import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { FieldsTable } from './fields-table';
import { fetchFieldsAction } from '../(actions)/fetchFieldsAction';

type Props = Readonly<{
  currentPage: number;
  query: string;
}>;

export const FieldsWrapper: FC<Props> = async ({
  currentPage,
  query,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { fields, pagination } = await fetchFieldsAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <FieldsTable
      fields={fields}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};
