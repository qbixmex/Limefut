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
import { Search } from '@/root/src/shared/components/search';

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
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Entrenadores</CardTitle>
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