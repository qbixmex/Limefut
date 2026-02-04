import { Suspense, type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Search } from "@/shared/components/search";
import { MessagesTableSkeleton } from "./(components)/messages-table-skeleton";
import { MessagesTable } from "./(components)/messages-table";

type Props = Readonly<{
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const MessagesPage: FC<Props> = async (props) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Mensajes</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar Mensaje ..." />
              </section>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Suspense
                key={`${query}-${currentPage}`}
                fallback={<MessagesTableSkeleton />}
              >
                <MessagesTable query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;