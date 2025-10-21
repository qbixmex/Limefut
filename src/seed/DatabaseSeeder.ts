import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { users } from "./users-seed";
import { tournaments } from "./tournaments-seed";
import { teams } from "./teams-seed";
import { coaches } from "./coaches-seed";
import { players } from "./players-seed";
import { credentials } from "./credentials-seed";
import type { Team, Player } from "../shared/interfaces";

export class DatabaseSeeder {
  static async clearUsers() {
    try {
      const usersCount = await prisma.user.count();
      console.log("Users Count:", usersCount);
      if (usersCount > 0) {
        const response = await prisma.user.deleteMany();
        console.log("Users Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting users:", (error as Error).message);
    }
  }

  static async clearTournaments() {
    try {
      const tournamentsCount = await prisma.tournament.count();
      console.log("Tournaments Count:", tournamentsCount);
      if (tournamentsCount > 0) {
        const response = await prisma.tournament.deleteMany();
        console.log("Tournaments Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting Tournaments:", (error as Error).message);
    }
  }

  static async clearTeams() {
    try {
      const teamsCount = await prisma.team.count();
      console.log("Teams Count:", teamsCount);
      if (teamsCount > 0) {
        const response = await prisma.team.deleteMany();
        console.log("Teams Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting teams:", (error as Error).message);
    }
  }

  static async clearCoaches() {
    try {
      const coachesCount = await prisma.coach.count();
      console.log("Coaches Count:", coachesCount);
      if (coachesCount > 0) {
        const response = await prisma.coach.deleteMany();
        console.log("Coaches Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting Coaches:", (error as Error).message);
    }
  }

  static async clearPlayers() {
    try {
      const playersCount = await prisma.player.count();
      console.log("Players Count:", playersCount);
      if (playersCount > 0) {
        const response = await prisma.player.deleteMany();
        console.log("Players Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting Players:", (error as Error).message);
    }
  }

  static async clearCredentials() {
    try {
      const credentialsCount = await prisma.credential.count();
      console.log("Credential Count:", credentialsCount);
      if (credentialsCount > 0) {
        const response = await prisma.credential.deleteMany();
        console.log("Credentials Deleted:", response.count);
      }
    } catch (error) {
      console.error("Error deleting Credentials:", (error as Error).message);
    }
  }

  static async clearAll() {
    console.log("Clearing all data 🧹 ...");
    await this.clearPlayers();
    await this.clearCoaches();
    await this.clearTeams();
    await this.clearTournaments();
    await this.clearUsers();
    await this.clearCredentials();
    console.log("All data cleared successfully! 👍");
  }

  static async seedUsers() {
    console.log('Saving users to the database ⏳ ...');
    const usersData = users.map((user) => {
      const encryptedPassword = bcrypt.hashSync(user.password, 10);
      return { ...user, password: encryptedPassword };
    });

    await prisma.user.createMany({ data: usersData });
    console.log('Users Inserted 👍');
  }

  static async seedTournaments() {
    console.log('Saving tournaments to the database ⏳ ...');
    await prisma.tournament.createMany({ data: tournaments });
    console.log('Tournaments Inserted 👍');
  }

  static async seedTeams() {
    console.log('Saving teams to the database ⏳ ...');

    // Get all available tournaments to assign teams.
    const tournamentsInDb = await prisma.tournament.findMany({
      select: { id: true, name: true }
    });

    if (tournamentsInDb.length === 0) {
      throw new Error('No tournaments found. Teams require a tournament. Make sure tournaments are seeded first.');
    }

    console.log(`Found ${tournamentsInDb.length} tournaments. Distributing teams...`);

    // Distribute teams among available tournaments
    const teamsData = teams.map((team, index) => {
      // Circular assignment of teams to tournaments
      const tournamentIndex = index % tournamentsInDb.length;
      const tournamentId = tournamentsInDb[tournamentIndex].id;
      const tournamentName = tournamentsInDb[tournamentIndex].name;

      console.log(`Assigning team "${team.name}" to tournament "${tournamentName}"`);

      const teamData = Object.fromEntries(
        Object.entries(team).filter(([key]) => key !== 'coachId')
      ) as Omit<typeof team, 'coachId'>;

      return {
        ...teamData,
        tournamentId,
        coachId: null, // Initially set to null; will be updated when seeding coaches
      };
    });

    await prisma.team.createMany({ data: teamsData });

    console.log('Teams Inserted 👍');
  }

  static async seedCoaches() {
    console.log('Saving coaches to the database ⏳ ...');

    // First, create coaches without teams
    const createdCoaches = [];
    for (const coach of coaches) {
      const { teamIds, ...coachFields } = coach;
      const createdCoach = await prisma.coach.create({
        data: coachFields
      });
      createdCoaches.push({ ...createdCoach, originalTeamIds: teamIds });
    }

    // Get all available teams to assign coaches
    const teamsInDb = await prisma.team.findMany({
      select: { id: true, name: true }
    });

    if (teamsInDb.length === 0) {
      console.log('No teams found. Coaches created without team assignments.');
      return;
    }

    console.log(`Found ${teamsInDb.length} teams. Assigning coaches to teams...`);

    // Distribute coaches among teams (circular)
    for (let i = 0; i < teamsInDb.length; i++) {
      const team = teamsInDb[i];
      const coachIndex = i % createdCoaches.length;
      const coach = createdCoaches[coachIndex];

      // Update the team to assign the coach
      await prisma.team.update({
        where: { id: team.id },
        data: { coachId: coach.id }
      });

      console.log(`Assigned coach "${coach.name}" to team "${team.name}"`);
    }

    console.log('Coaches Inserted 👍');
  }

  static async seedPlayers() {
    console.log('Saving players to the database ⏳ ...');

    const teamsCount = await prisma.team.count();

    if (teamsCount === 0) {
      console.log('No teams found. Creating players without teams...');
      await prisma.player.createMany({ data: players });
    } else {
      console.log(`Found ${teamsCount} teams. Assigning players to teams...`);

      const teamsInDb = await prisma.team.findMany({
        select: { id: true, name: true }
      });

      const playersData = players.map((player, index) => {
        const teamIndex = index % teamsInDb.length;
        const teamId = teamsInDb[teamIndex].id;
        return {
          ...player,
          teamId
        };
      });

      await prisma.player.createMany({ data: playersData });
    }

    console.log('Players Inserted 👍');
  }

  static async seedCredentials() {
    console.log('Saving credentials to the database ⏳ ...');

    // Get all existing players and its tournament
    const playersInDb = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        birthday: true,
        team: {
          select: {
            tournamentId: true
          }
        }
      }
    });

    // Filter only players who have a team and tournament assigned
    const validPlayers = playersInDb.filter(
      player => player.team && player.team.tournamentId
    ) as (Player & { team: Team })[];

    if (validPlayers.length === 0) {
      console.log('No players with team and tournament found. Credentials will not be seeded.');
      return;
    }

    // Distribute credentials among valid players
    const credentialsData = credentials.map((credential, index) => {
      const player = validPlayers[index % validPlayers.length];

      return {
        ...credential,
        playerId: player.id,
        fullName: player.name,
        birthdate: player.birthday ?? credential.birthdate,
        tournamentId: player.team.tournamentId,
      };
    });

    await prisma.credential.createMany({ data: credentialsData });

    console.log('Credentials Inserted 👍');
  }

  static async seedAll() {
    console.log('Seed started 🚀');
    await this.seedUsers();
    await this.seedTournaments(); // Seed tournaments before teams
    await this.seedTeams(); // Seed teams before coaches and players
    await this.seedCoaches();
    await this.seedPlayers();
    await this.seedCredentials();
    console.log('Seed executed 🎉');
  }

  static async resetDatabase() {
    await this.clearAll();
    await this.seedAll();
  }
}
