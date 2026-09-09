import type { FC } from 'react';
import { getSession } from '@/lib/get-session';
import { FieldsTable } from './fields-table';
import { fetchFieldsAction } from '../(actions)';

type Props = Readonly<{
  currentPage: number;
  query: string;
}>;

export const FieldsWrapper: FC<Props> = async ({
  currentPage,
  query,
}) => {
  const session = await getSession();

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
