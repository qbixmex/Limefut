import type { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SeoRobots } from '../(components)/seo-robots';
import type { ROBOTS } from '@/shared/interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { rehypeYoutube } from '@/lib/rehype-youtube';
import { EditCustomPage } from '../(components)/edit-custom-page';
import { redirect } from 'next/navigation';
import { fetchPageAction, type CUSTOM_PAGE_TYPE } from '../(actions)/fetchPageAction';
import type { PAGE_STATUS } from '@/shared/interfaces/Page';
import { getPageStatus } from '@/lib/utils';
import 'highlight.js/styles/tokyo-night-dark.min.css';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const CustomPageDetailsView: FC<Props> = async ({ params }) => {
  const pageId = (await params).id;

  const response = await fetchPageAction(pageId);

  if (!response.ok) {
    redirect(`/admin/paginas?error=${encodeURIComponent(response.message)}`);
  }

  const page = response.page as CUSTOM_PAGE_TYPE;
  const pageStatus = getPageStatus(page.status as PAGE_STATUS);

  return (
    <>
      <section className="flex flex-col lg:flex-row mb-10">
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="font-semibold w-[180px]">Título</TableHead>
                <TableCell className="text-gray-400 italic">
                  {
                    page.title ?? (
                      <Badge variant="outline-secondary">
                        No definido
                      </Badge>
                    )
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[180px] font-semibold">Enlace Permanente</TableHead>
                <TableCell className="text-gray-400 italic">
                  {
                    page.permalink ?? (
                      <Badge variant="outline-secondary">
                        No definido
                      </Badge>
                    )
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
                <TableCell className="text-gray-300 italic">
                  {format(page.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                <TableCell className="text-gray-300 italic">
                  {format(page.updatedAt, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-medium w-[180px]">Estado</TableHead>
                <TableCell>
                  <Badge variant={pageStatus.variant}>{pageStatus.label}</Badge>
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
                <TableCell className="text-gray-300 italic">
                  {page.seoTitle ?? 'No definido'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold w-[180px]">Descripción SEO</TableHead>
                <TableCell className="text-gray-300 italic">
                  {
                    page.seoDescription ? (
                      <p className="text-pretty">{page.seoDescription}</p>
                    ) : (
                      <Badge variant="outline-secondary">
                        No definida
                      </Badge>
                    )
                  }
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

      <section className="prose prose-lg dark:prose-invert max-w-none mb-10">
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
        <EditCustomPage pageId={page.id} />
      </div>
    </>
  );
};
