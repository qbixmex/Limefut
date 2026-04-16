import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchFieldAction } from '../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';
import { SoccerFieldIcon } from '@/shared/components/icons/soccer-field.icon';
import { redirect } from 'next/navigation';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const FieldPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <FieldContent params={params} />
    </Suspense>
  );
};

const FieldContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const fieldId = (await params).id;

  const response = await fetchFieldAction(fieldId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_FIELDS}?error=${encodeURIComponent(response.message)}`);
  }

  const field = response.field!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              <div className="w-full max-w-[512px] h-auto relative">
                <div className="bg-gray-200 dark:bg-gray-800 p-5 w-full max-w-[512px] h-auto rounded-xl flex items-center justify-center">
                  <SoccerFieldIcon size={512} strokeWidth={0.5} className="stroke-gray-400" />
                </div>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-[180px]">Nombre</TableHead>
                    <TableCell>{field.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Ciudad</TableHead>
                    <TableCell>{field.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableCell>{field.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">País</TableHead>
                    <TableCell>{field.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Enlace Permanente</TableHead>
                    <TableCell>{field.permalink}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Dirección</TableHead>
                    <TableCell>
                      <span className="text-wrap">
                        {field.address ?? 'No especificada'}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
                    <TableCell>
                      {format(new Date(field?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                    <TableCell>
                      {format(new Date(field?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={ROUTES.ADMIN_FIELD_EDIT(field.id as string)}
                    className={
                      buttonVariants({ variant: 'outline-warning', size: 'icon' })
                    }
                  >
                    <Pencil />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldPage;
