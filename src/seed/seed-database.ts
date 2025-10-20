import { DatabaseSeeder } from "./DatabaseSeeder";

const main = async () => {
  // await DatabaseSeeder.clearUsers();
  // await DatabaseSeeder.seedUsers();

  // await DatabaseSeeder.clearTournaments();
  // await DatabaseSeeder.seedTournaments();

  // await DatabaseSeeder.clearTeams();
  // await DatabaseSeeder.seedTeams();

  // await DatabaseSeeder.clearCoaches();
  // await DatabaseSeeder.seedCoaches();

  // await DatabaseSeeder.clearPlayers();
  // await DatabaseSeeder.seedPlayers();

  // await DatabaseSeeder.clearCredentials();
  // await DatabaseSeeder.seedCredentials();

  await DatabaseSeeder.clearAll();
  await DatabaseSeeder.seedAll();
};

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();