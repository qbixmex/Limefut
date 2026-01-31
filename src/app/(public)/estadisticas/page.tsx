import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { Standings } from './(components)/standings';
import { ErrorHandler } from "@/shared/components/errorHandler";
import {
  Heading,
  TournamentsSelector,
  TournamentsSelectorSkeleton,
} from '../components';
import "./styles.css";

export const metadata: Metadata = {
  title: 'Tabla de posiciones',
  description: 'Tabla de posiciones por torneo.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
    categoria: string;
    formato: string;
  }>;
}>;

export const StandingsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Estadísticas
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <TournamentsSelector />
      </Suspense>

      <Suspense>
        <ErrorHandler />
        <Standings searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default StandingsPage;
