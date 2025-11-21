import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { Heading } from "../components";
import { TournamentsSelectorSkeleton } from "./(components)/TournamentsSelectorSkeleton";
import { TournamentsSelector } from "./(components)/TournamentsSelector";
import { TeamsContent } from "./(components)/TeamsContent";

export const metadata: Metadata = {
  title: 'Equipos',
  description: 'Equipos participantes.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
  }>;
}>;

const TeamsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-500">
        Equipos
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <TournamentsSelector />
      </Suspense>

      <Suspense>
        <TeamsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TeamsPage;