import type { FC } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MatchType } from '@/app/(public)/resultados/(actions)/fetchResultsAction';
import { MatchRow } from './match-row';

type Props = Readonly<{
  matches: MatchType[];
}>;

export const MatchesTable: FC<Props> = ({ matches }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="hidden lg:table-cell">Fecha</TableHead>
        <TableHead className="hidden lg:table-cell">Hora</TableHead>
        <TableHead className="hidden lg:table-cell">Sede</TableHead>
        <TableHead>
          <div className="grid grid-cols-[1fr_100px_1fr]">
            <span className="text-right">Equipo Local</span>
            <span>{' '}</span>
            <span className="text-left">Equipo Visitante</span>
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell text-left">Estado</TableHead>
        <TableHead className="hidden lg:table-cell">&nbsp;</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} />
      ))}
    </TableBody>
  </Table>
);
