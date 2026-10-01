import type { FC } from 'react';
import { Suspense } from 'react';
import { MessagesView } from './messages-view';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const MessagesPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <MessagesView searchParams={searchParams} />
    </Suspense>
  );
};

export default MessagesPage;
