import type { FC } from 'react';
import { Check, MinusIcon, XIcon } from 'lucide-react';
import { cn } from '~/src/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { SHOOTOUT_STATUS } from '@/shared/enums';
import type { PENALTY_SHOOTOUT_TYPE } from '@/shared/types/penalty_shootout_type';

type Props = Readonly<{
  shootout: PENALTY_SHOOTOUT_TYPE | null | undefined;
}>;

export const PenaltyShootout: FC<Props> = ({ shootout }) => {
  return (
    <>
      {(shootout) && (
        <>
          <section className="relative w-full max-w-[300px] mb-10">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Ganador:</TableHead>
                  <TableCell>
                    <ShootoutWinner
                      winnerTeamId={shootout.winnerTeamId}
                      localTeam={shootout.localTeam}
                      visitorTeam={shootout.visitorTeam}
                    />
                  </TableCell>
                </TableRow>
                {(shootout.kicks.length === 0) && (
                  <>
                    <TableRow>
                      <TableHead>{shootout.localTeam.name}</TableHead>
                      <TableCell>
                        <span className="text-sky-600 dark:text-sky-500 font-bold">
                          {shootout.localGoals}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>{shootout.visitorTeam.name}</TableHead>
                      <TableCell>
                        <span className="text-sky-600 dark:text-sky-500 font-bold">
                          {shootout.visitorGoals}
                        </span>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                <TableRow>
                  <TableHead>Estado:</TableHead>
                  <TableCell>
                    {shootout.status === SHOOTOUT_STATUS.IN_PROGRESS && 'En Progreso'}
                    {shootout.status === SHOOTOUT_STATUS.COMPLETED && 'Completado'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          {(shootout.kicks.length > 0) && (
            <div className="w-full lg:max-w-md flex flex-col gap-5 mb-8">
              <div className="grid grid-cols-2 items-center gap-5">
                <span className="justify-self-end space-x-2">
                  <span className="text-sm text-gray-500">( {shootout.localGoals} )</span>
                  <span className="text-gray-200 font-semibold">
                    {shootout.localTeam.name}
                  </span>
                </span>
                <span className="justify-self-start space-x-2">
                  <span className="text-gray-200 font-semibold">
                    {shootout.visitorTeam.name}
                  </span>
                  <span className="text-sm text-gray-500">( {shootout.visitorGoals} )</span>
                </span>
              </div>

              <div className="grid grid-cols-2 items-center gap-5">
                {shootout.kicks.map((kick) => (
                  <div
                    key={kick.id}
                    className={cn('flex items-center gap-5', {
                      'justify-end': kick.teamId === shootout.localTeam.id,
                      'justify-start': kick.teamId === shootout.visitorTeam.id,
                    })}
                  >
                    <span
                      className={cn({
                        'order-1': kick.teamId === shootout.localTeam.id,
                        'order-2': kick.teamId === shootout.visitorTeam.id,
                      })}
                    >{kick.shooterName}</span>
                    <PenaltiIcon
                      isGoal={kick.isGoal}
                      className={cn({
                        'order-2': kick.teamId === shootout.localTeam.id,
                        'order-1': kick.teamId === shootout.visitorTeam.id,
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const ShootoutWinner: FC<{
  winnerTeamId: string | null;
  localTeam: { id: string; name: string; };
  visitorTeam: { id: string; name: string; };
}> = ({ winnerTeamId, localTeam, visitorTeam }) => {
  return (
    <>
      {winnerTeamId ? (
        <>
          {(winnerTeamId === localTeam.id) && (
            <p className="text-emerald-500 font-semibold">
              {localTeam.name}
            </p>
          )}
          {(winnerTeamId === visitorTeam.id) && (
            <p className="text-emerald-500 font-semibold">
              {visitorTeam.name}
            </p>
          )}
        </>
      ) : (
        <span>No definido aún</span>
      )}
    </>
  );
};

const PenaltiIcon: FC<{
  isGoal: boolean | null;
  className?: string;
}> = ({ isGoal = undefined, className = '' }) => {
  return (
    <div className={cn('size-[32px] flex justify-center items-center rounded-full',
      className,
      {
        'bg-emerald-600 text-emerald-50': isGoal,
        'bg-rose-600 text-rose-50': !isGoal,
        'bg-gray-600 text-gray-50': isGoal === null,
      },
    )}>
      {(isGoal === true)
        ? <Check size={18} />
        : (isGoal === false)
          ? <XIcon size={18} />
          : <MinusIcon size={18} strokeWidth={3} />
      }
    </div>
  );
};
