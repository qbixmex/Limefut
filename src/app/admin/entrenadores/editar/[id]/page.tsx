import { Suspense, type FC } from 'react';
import { EditCoachPageView } from './edit-coach-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditCoachPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditCoachPageView params={params} />
    </Suspense>
  );
};

export default EditCoachPage;
