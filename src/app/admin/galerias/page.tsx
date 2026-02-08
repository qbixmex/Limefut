import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GalleriesTable } from './(components)/galleries-table';
import Search from '@/shared/components/search';
import { GalleriesTableSkeleton } from './(components)/galleries-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const GalleryPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <GalleryContent searchParams={searchParams} />
    </Suspense>
  );
};

const GalleryContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Galerías</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar galería ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/galerias/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">crear</TooltipContent>
                </Tooltip>
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query ?? 'query'}-${currentPage}`}
                fallback={<GalleriesTableSkeleton />}
              >
                <GalleriesTable
                  query={query}
                  currentPage={currentPage}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
