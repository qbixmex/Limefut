import { Suspense, type FC } from 'react';
import { EditFieldPageView } from './edit-field-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditFieldPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditFieldPageView params={params} />
    </Suspense>
  );
};

export default EditFieldPage;
