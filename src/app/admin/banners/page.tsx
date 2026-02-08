import { Suspense, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Search } from "@/shared/components/search";
import BannersTableSkeleton from "./(components)/banners-table-skeleton";
import BannersTable from "./(components)/banners-table";

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const BannersPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <BannersContent searchParams={searchParams} />
    </Suspense>
  );
};

const BannersContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query ?? '';
  const currentPage = (await searchParams).page ?? '1';

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">
                Lista de Banners
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar banner ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/banners/crear">
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
              <Suspense
                key={`${query ?? 'query'}-${currentPage}`}
                fallback={<BannersTableSkeleton />}
              >
                <BannersTable
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

export default BannersPage;