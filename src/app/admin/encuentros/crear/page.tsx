import { type FC, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MatchWrapper } from "./create-match-content";
import TournamentsSelector from "../(components)/selectors/tournaments-selector";
import { TournamentsSelectorSkeleton } from "~/src/app/(public)/components";

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
    semana: string;
  }>;
}>;

const CreateMatchPage: FC<Props> = async ({ searchParams }) => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TournamentsSelectorSkeleton />}>
              <TournamentsSelector />
            </Suspense>
            <Suspense>
              <MatchWrapper searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
