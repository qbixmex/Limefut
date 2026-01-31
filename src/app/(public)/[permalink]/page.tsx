import { Suspense, type FC } from 'react';
import { PageWrapper } from './page-wrapper';
import type { Metadata, ResolvingMetadata } from 'next';
import { fetchCustomPageMetadataAction } from './(actions)/fetchCustomPageMetadata';
import "./styles.css";

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
    robots: pageMetadata?.seoRobots ?? "index, follow",
  };
};

export const CustomPage: FC<Props> = ({ params }) => {
  const permalinkPromise = params.then((p) => ({ permalink: p.permalink }));

  return (
    <div className="wrapper justify-start dark:bg-gray-600/20!">
      <Suspense>
        <PageWrapper permalinkPromise={permalinkPromise} />
      </Suspense>
    </div>
  );
};

export default CustomPage;
