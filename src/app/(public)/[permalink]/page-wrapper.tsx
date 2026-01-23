import { Suspense, type FC } from "react";
import { PageContent } from "./page-content";

type Props = Readonly<{
  permalinkPromise: Promise<{
    permalink: string;
  }>;
}>;

export const PageWrapper: FC<Props> = async ({ permalinkPromise }) => {
  const { permalink } = await permalinkPromise;

  return (
    <Suspense fallback={<p>Espere por favor ...</p>}>
      <PageContent permalink={permalink} />
    </Suspense>
  );
};
