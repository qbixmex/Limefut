import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
// TODO import { fetchFieldsAction } from '../../equipos/(actions)/fetchTeamsAction';
// TODO import { FieldsTable } from '../../equipos/(components)/teams-table';
import type { Field } from '@/shared/interfaces/Field';
import { FieldsTable } from './fields-table';

type Props = Readonly<{
  currentPage: number;
  query: string;
}>;

const fields: Field[] = [
  {
    id: 'abc',
    name: 'Country Club',
    permalink: 'Country Club',
    city: 'Zapopan',
    state: 'Jalisco',
    country: 'México',
    address: 'Avenida siempre viva #333',
    createdAt: new Date('2025-08-12'),
    updatedAt: new Date('2025-08-12'),
  },
  {
    id: 'def',
    name: 'Soccer Field',
    permalink: 'soccer-field',
    city: 'Zapopan',
    state: 'Jalisco',
    country: 'México',
    address: 'Paseo de los olivos #333',
    createdAt: new Date('2025-08-13'),
    updatedAt: new Date('2025-08-13'),
  },
];

const pagination = {
  currentPage: 1,
  totalPages: 12,
};

export const FieldsWrapper: FC<Props> = async ({
  currentPage,
  query,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // const { teams, pagination } = await fetchFieldsAction({
  //   page: currentPage,
  //   take: 12,
  //   searchTerm: query,
  // });

  return (
    <FieldsTable
      fields={fields}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};
