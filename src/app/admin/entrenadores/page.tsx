import { Suspense, type FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { CoachesTable } from './(components)/coaches-table';
import { CoachesTableSkeleton } from './(components)/coaches-table-skeleton';
import { Search } from '@/shared/components/search';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const CoachesPage: FC<Props> = async ({ searchParams }) => {
  const paramsPromise = searchParams.then((sp) => ({
    query: sp.query ?? '',
    currentPage: Number(sp.page) ?? 1,
  }));

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Entrenadores</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar entrenador ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/entrenadores/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </section>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <CoachesTableSkeleton colCount={7} rowCount={6} />
              }>
                <CoachesTable paramsPromise={paramsPromise} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CoachesPage;