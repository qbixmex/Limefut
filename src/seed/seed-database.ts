import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { users } from "./users-seed";
import { tournaments } from "./tournaments-seed";
import { teams } from "./teams-seed";
import { coaches } from './coaches-seed';
import { players } from './players-seed';

const main = async () => {
  console.log("Clearing the data 🧹 ...");

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

  console.log("All data cleared successfully! 👍");

  console.log('Seed started 🚀');

  const usersData = users.map((user) => {
    const encryptedPassword = bcrypt.hashSync(user.password, 10);

    return {
      ...user,
      password: encryptedPassword,
    };
  });

  // Perform to save the users in the database
  console.log('Saving users to the database ⏳ ...');

  await prisma.user.createMany({ data: usersData });

  console.log('Users Inserted 👍');

  console.log('Saving teams to the database ⏳ ...');

  await prisma.tournament.createMany({ data: tournaments });

  console.log('Tournaments Inserted 👍');

  await prisma.team.createMany({ data: teams });

  console.log('Teams Inserted 👍');

  await prisma.coach.createMany({ data: coaches });

  console.log('Coaches Inserted 👍');

  await prisma.player.createMany({ data: players });

  console.log('Players Inserted 👍');

  console.log('Seed executed 🎉');
};

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();