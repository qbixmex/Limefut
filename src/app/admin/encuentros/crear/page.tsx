import { type FC, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MatchWrapper } from "./create-match-content";
import { TournamentsSelector } from "../(components)/selectors/tournaments-selector";
import { TournamentsSelectorSkeleton } from "~/src/app/(public)/components";

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
    semana: string;
  }>;
}>;

const CreateMatchPage: FC<Props> = async ({ searchParams }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Encuentro</CardTitle>
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
