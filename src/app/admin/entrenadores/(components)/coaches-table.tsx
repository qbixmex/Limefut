import { type FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Pencil, InfoIcon } from "lucide-react";
import { GiWhistle } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchCoachesAction, updateCoachStateAction } from "../(actions)";
import { DeleteCoach } from "../(components)/delete-coach";
import { Pagination } from '@/shared/components/pagination';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { auth } from "@/lib/auth";
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const CoachesTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    coaches = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchCoachesAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {coaches && coaches.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-center">Equipos</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coaches.map((coach) => (
                  <TableRow key={coach.id}>
                    <TableCell>
                      <Link href={`/admin/entrenadores/${coach.id}`}>
                        {
                          !coach.imageUrl ? (
                            <figure className="bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
                              <GiWhistle size={35} className="text-gray-300" />
                            </figure>
                          ) : (
                            <Image
                              src={coach.imageUrl}
                              alt={`${coach.name} picture`}
                              width={75}
                              height={75}
                              className="size-18 rounded-xl object-cover"
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell>{coach.name}</TableCell>
                    <TableCell>{coach.email}</TableCell>
                    <TableCell>{coach.phone}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-info">{coach.teamsCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: coach.id, state: coach.active }}
                        updateResourceStateAction={updateCoachStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/entrenadores/perfil/${coach.id}`}>
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
                            <Link href={`/admin/entrenadores/editar/${coach.id}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteCoach
                          coachId={coach.id}
                          roles={session?.user.roles as string[]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay entrenadores
          </p>
        </div>
      )}
    </>
  );
};
