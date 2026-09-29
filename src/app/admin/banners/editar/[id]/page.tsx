import { Suspense, type FC } from 'react';
import { EditBannerPageView } from './edit-banner-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditBannerPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditBannerPageView params={params} />
    </Suspense>
  );
};

export default EditBannerPage;
