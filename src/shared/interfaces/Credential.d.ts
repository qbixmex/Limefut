import type { Player } from './Player';
import type { Tournament } from './Tournament';

export interface Credential {
  id: string;
  fullName: string;
  birthdate: Date;
  curp: string;
  position: string;
  jerseyNumber: number;

  // Relations
  player?: Partial<Player>;
  tournament?: Partial<Tournament>;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;  
}

export interface CredentialSeed extends Omit<Credential, 'id' | 'player' | 'tournament' | 'createdAt' | 'updatedAt'> {
  playerId: string;
  tournamentId: string;
}