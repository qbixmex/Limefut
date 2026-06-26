import { Suspense, type FC } from 'react';
import { Heading } from '../components';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { VideosView } from './(components)/videos-view';
import { VideosSkeleton } from './(components)/videos-view/videos-skeleton';
import { Search } from '@/shared/components/search';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const VideosPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper">
      <div className="flex flex-col gap-5 mb-5 lg:gap-0 lg:flex-row lg:justify-between">
        <Heading level="h1" className="text-emerald-600">
          Videos
        </Heading>
        <div className="w-full lg:w-[350px]">
          <Search placeholder="Buscar video" />
        </div>
      </div>
      <Suspense fallback={<VideosSkeleton />}>
        <ErrorHandler />
        <VideosView searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default VideosPage;
