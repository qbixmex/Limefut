import { Suspense, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlusIcon, } from "lucide-react";
import Link from "next/link";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Search } from "@/shared/components/search";
import UsersTable from "./(components)/users-table";
import { UsersTableSkeleton } from "./(components)/users-table-skeleton";

type Props = Readonly<{
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const UsersPage: FC<Props> = async (props) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full flex flex-col bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Usuarios</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar usuario ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/usuarios/crear">
                      <Button variant="outline-primary" size="icon">
                        <UserPlusIcon />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </section>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Suspense key={`${query}-${currentPage}`} fallback={<UsersTableSkeleton />}>
                <UsersTable query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UsersPage;