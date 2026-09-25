import { Suspense, type FC } from 'react';
import { PageView } from './page-view';
import type { Metadata, ResolvingMetadata } from 'next';
import { fetchCustomPageMetadataAction } from './(actions)/fetchCustomPageMetadata';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';
import { PageSkeleton } from './page-view/page-skeleton';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const generateMetadata = async (
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { permalink } = await props.params;
  const { pageMetadata } = await fetchCustomPageMetadataAction(permalink);

  return {
    title: pageMetadata?.seoTitle ?? (await parent).title,
    description: pageMetadata?.seoDescription ?? (await parent).description,
    robots: pageMetadata?.seoRobots ?? 'index, follow',
  };
};

export const CustomPage: FC<Props> = ({ params }) => {
  return (
    <div className={cn('wrapper', styles.customPage)}>
      <Suspense fallback={<PageSkeleton />}>
        <PageView params={params} />
      </Suspense>
    </div>
  );
};

export default CustomPage;
