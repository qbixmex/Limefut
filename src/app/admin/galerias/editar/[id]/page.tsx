import { Suspense, type FC } from 'react';
import { EditGalleryPageView } from './edit-gallery-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditGalleryPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditGalleryPageView params={params} />
    </Suspense>
  );
};

export default EditGalleryPage;
