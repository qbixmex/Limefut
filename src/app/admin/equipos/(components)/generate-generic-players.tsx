'use client';

import { useState, type FC } from 'react';
import { generatePlayersAction } from '../(actions)/generate-generic-players';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '~/src/lib/utils';
import { Loader } from 'lucide-react';

type Props = {
  userRoles: string[] | undefined;
  teamId: string;
  gender: 'male' | 'female',
};

export const GenerateGenericPlayers: FC<Props> = ({ userRoles, teamId, gender }) => {
  const [ generatingPlayers, setGeneratingPlayers ] = useState(false);

  const handleGeneratePlayers = async () => {
    setGeneratingPlayers(true);

    const { ok, message } = await generatePlayersAction({
      userRoles,
      teamId,
      gender,
    });

    if (!ok) {
      setGeneratingPlayers(false);
      toast.error(message);
    }

    if (ok) {
      setGeneratingPlayers(false);
      toast.success(message);
    }
  };

  return (
    <Button
      className={cn("w-full", {
        "text-gray-200 hover:bg-secondary": generatingPlayers,
      })}
      size="lg"
      onClick={handleGeneratePlayers}
      disabled={generatingPlayers}
      variant={ generatingPlayers ? "secondary" : "outline-primary"}
    >
      {
        !generatingPlayers
          ? 'Generar jugadores genéricos'
          : (
            <span className="flex gap-2 items-center animate-pulse">
              <span className="italic text-sm">generando</span>
              <Loader className="animate-spin" />
            </span>
          )
        }
    </Button>
  );
};
