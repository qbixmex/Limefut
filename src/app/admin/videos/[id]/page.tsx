import type { FC } from 'react';
import { Suspense } from 'react';
import { VideoView } from './video-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const VideoPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <VideoView params={params} />
    </Suspense>
  );
};

export default VideoPage;
