'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// TODO import { DeleteField } from '../(components)/delete-field';
// TODO import { updateFieldStateAction } from '../(actions)';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pencil,
  InfoIcon,
  Flag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ActiveSwitch } from '@/shared/components/active-switch';
import type { Field } from '@/shared/interfaces';
import { ROUTES } from '@/shared/constants/routes';
// import type { FieldType } from '../(actions)/fetchTeamsAction';

type Props = Readonly<{
  fields: Field[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  roles: string[];
}>;

export const FieldsTable: FC<Props> = ({ fields, pagination, roles }) => {
  return (
    <>
      {(fields.length > 0) ? (
        <div className="flex-1 flex flex-col mt-10">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="">Nombre</TableHead>
                  <TableHead className="hidden">Ciudad</TableHead>
                  <TableHead className="hidden">Estado</TableHead>
                  <TableHead className="hidden">País</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-bold text-center">{index + 1}</TableCell>
                    <TableCell className="">{field.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{field.city}</TableCell>
                    <TableCell className="hidden">{field.state}</TableCell>
                    <TableCell className="hidden">{field.country}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={ROUTES.ADMIN_FIELD(field.id as string)}>
                              <Button variant="outline-info" size="icon">
                                <InfoIcon />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            detalles
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={ROUTES.ADMIN_FIELD_EDIT(field.id as string)}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* <DeleteField fieldId={field.id} roles={roles} /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn('flex justify-center mt-10', {
            hidden: pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded mt-10">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No se encontraron canchas de juego
          </p>
        </div>
      )}
    </>
  );
};
