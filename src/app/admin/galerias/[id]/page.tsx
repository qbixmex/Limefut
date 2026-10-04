import { Suspense, type FC } from 'react';
import { GalleryDetailsView } from './gallery-details-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const GalleryDetailsPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <GalleryDetailsView params={params} />
    </Suspense>
  );
};

export default GalleryDetailsPage;
