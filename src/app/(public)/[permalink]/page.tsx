import { Suspense, type FC } from 'react';
import { PageWrapper } from './page-wrapper';
// import type { Metadata, ResolvingMetadata } from 'next';
import "./styles.css";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

// TODO: METADATA
// export const generateMetadata = async (
//   props: Props,
//   parent: ResolvingMetadata,
// ): Promise<Metadata> => {
//   const { permalink } = await props.params;

//   // fetch data
//   const customPage = await fetch(`https://.../${id}`).then((res) => res.json())

//   // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || []

//   return {
//     title: customPage.title,
//     openGraph: {
//       images: ['/some-specific-page-image.jpg', ...previousImages],
//     },
//   };
// };

export const CustomPage: FC<Props> = ({ params }) => {
  const permalinkPromise = params.then((p) => ({ permalink: p.permalink }));

  return (
    <div className="wrapper justify-start dark:bg-gray-600/20">
      <Suspense>
        <PageWrapper permalinkPromise={permalinkPromise} />
      </Suspense>
    </div>
  );
};

export default CustomPage;
