import { Suspense, type FC } from "react";
import { PageContent } from "./page-content";
import { PageSkeleton } from "./page-skeleton";

type Props = Readonly<{
  permalinkPromise: Promise<{
    permalink: string;
  }>;
}>;

export const PageWrapper: FC<Props> = async ({ permalinkPromise }) => {
  const { permalink } = await permalinkPromise;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent permalink={permalink} />
    </Suspense>
  );
};
