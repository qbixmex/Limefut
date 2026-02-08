import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchPageAction } from '../(actions)/fetchPageAction';
import { SeoRobots } from '../(components)/seo-robots';
import type { Page, ROBOTS } from '@/shared/interfaces';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { rehypeYoutube } from "@/lib/rehype-youtube";
import "highlight.js/styles/tokyo-night-dark.min.css";
import type { PAGE_STATUS } from '@/shared/interfaces/Page';
import { getPageStatus } from '@/lib/utils';
import { headers } from 'next/headers';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const PageDetails: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const pageId = (await params).id;

  const response = await fetchPageAction(session?.user.roles ?? [], pageId);

  if (!response.ok) {
    redirect(`/admin/paginas?error=${encodeURIComponent(response.message)}`);
  }

  const page = response.page as Page;
  const pageStatus = getPageStatus(page.status as PAGE_STATUS);

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Página</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col lg:flex-row mb-10">
              <div className="w-full lg:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título</TableHead>
                      <TableCell className="text-gray-400 italic">{page.title ?? 'No definido'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Enlace Permanente</TableHead>
                      <TableCell className="text-gray-400 italic">{page.permalink ?? 'No definido'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
                      <TableCell className="text-gray-300 italic">
                        {format(new Date(page?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                      <TableCell className="text-gray-300 italic">
                        {format(new Date(page?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-medium w-[180px]">Estado</TableHead>
                      <TableCell>
                        {<Badge variant={pageStatus.variant}>{pageStatus.label}</Badge>}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-bold text-sky-600 mb-5">Seo</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título SEO</TableHead>
                      <TableCell className="text-gray-300 italic">{page.seoTitle ?? 'No definido'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Descripción SEO</TableHead>
                      <TableCell className="text-gray-300 italic">
                        <p className="text-pretty">{page.seoDescription ?? 'No definida'}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Robots SEO</TableHead>
                      <TableCell>
                        <SeoRobots robots={page.seoRobots as ROBOTS} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <h2 className="text-xl font-semibold text-sky-500 mb-2">Contenido</h2>

            <section className={"prose prose-lg dark:prose-invert max-w-none mb-10"}>
              {page.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeYoutube]}
                >
                  {page.content}
                </ReactMarkdown>
              ) : (
                <span className="text-gray-400">No definido</span>
              )}
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/paginas/editar/${page.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>editar</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageDetails;
