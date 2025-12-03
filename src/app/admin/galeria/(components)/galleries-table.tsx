import type { FC } from 'react';

type Props = Readonly<{
  query: string | undefined;
  currentPage: string | undefined;
}>;

export const GalleriesTable: FC<Props> = ({
  query = '',
  currentPage = 1,
}) => {
  return (
    <>
      <p>Gallery List</p>
      <p>Query: {query === '' ? 'not defined' : query}</p>
      <p>Gallery List {currentPage}</p>
    </>
  );
};

export default GalleriesTable;
