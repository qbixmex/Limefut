import { Suspense, type FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryDetails } from "../(components)/gallery-details";
import { GallerySkeleton } from "../(components)/gallery-skeleton";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

const GalleryPage: FC<Props> = ({ params }) => {
  return (
    <section className="sm:px-5 xl:px-0 flex-1 rounded flex flex-col item-center justify-center">
      <Card className="rounded-none! sm:rounded-lg! flex-1 lg:p-10">
        <CardContent>
          <Suspense fallback={<GallerySkeleton />}>
            <GalleryDetails paramsPromise={params} />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
};

export default GalleryPage;
