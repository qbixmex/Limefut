'use client';

import { type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import type { StandingType } from "../(actions)/fetchStandingsAction";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/root/src/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/root/src/components/ui/tooltip";
import "./standingsTableStyles.css";
import { deleteStandingsAction } from "../(actions)/deleteStandingsAction";
import { toast } from "sonner";

type Props = {
  tournamentId: string;
  standings: StandingType[];
  onDeletedStandings: (tournamentId: string) => void;
};

export const StandingsTable: FC<Props> = ({ standings, tournamentId, onDeletedStandings }) => {
  const handleDeleteStandings = async () => {
    try {
      const response = await deleteStandingsAction(tournamentId);
      if (!response.ok) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        onDeletedStandings(tournamentId);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Equipo</TableHead>
            <TableHead className="text-gray-400 text-center">Jugados</TableHead>
            <TableHead className="text-gray-400 text-center">Ganados</TableHead>
            <TableHead className="text-gray-400 text-center">Perdidos</TableHead>
            <TableHead className="text-gray-400 text-center">Goles a favor</TableHead>
            <TableHead className="text-gray-400 text-center">Goles en contra</TableHead>
            <TableHead className="text-gray-400 text-center">Diferencia</TableHead>
            <TableHead className="text-gray-400 text-center">Puntos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.team.id}>
              <TableCell>
                <Link href={`/admin/equipos/${standing.team.permalink}`} target="_blank">
                  {standing.team.name}
                </Link>
              </TableCell>
              <TableCell className="text-blue-500 text-center">{standing.matchesPlayed}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.wings}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.losses}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsFor}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsDifference}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="absolute z-50 -top-10 right-0">
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="outline-danger" size="icon">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>eliminar</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿ Estas seguro de eliminar la tabla ?</AlertDialogTitle>
              <AlertDialogDescription>
                Si elimina la tabla, todas las estadísticas se perderán y no podrán ser recuperadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="delete-btn"
                onClick={handleDeleteStandings}
              >
                eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};