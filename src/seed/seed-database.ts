import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { initialData } from "./seeds";

const main = async () => {
  console.log("Clearing the data 🧹 ...");

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
    const usersCount = await prisma.user.count();
    console.log("Users Count:", usersCount);
    if (usersCount > 0) {
      const response = await prisma.user.deleteMany();
      console.log("Users Deleted:", response.count);
    }
  } catch (error) {
    console.error("Error deleting users:", (error as Error).message);
  }

  console.log("All data cleared successfully! 👍");

  console.log('Seed started 🚀');

  const { users, teams } = initialData;

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

  await prisma.team.createMany({ data: teams });

  console.log('Teams Inserted 👍');

  console.log('Seed executed 🎉');
};

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();