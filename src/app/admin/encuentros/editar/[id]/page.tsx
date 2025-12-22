import { Suspense, type FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormSkeleton from "../../(components)/form-skeleton";
import EditMatchContent from "./edit-match-content";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditMatch: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FormSkeleton />}>
              <EditMatchContent matchId={matchId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMatch;
