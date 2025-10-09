import { auth } from "@/auth.config";

export const DashboardPage = async () => {
  const session = await auth();
  const user = session!.user;

  return (
    <>
      <h1 className="text-5xl py-10">Admin Dashboard</h1>
      <p>User Email: { user.email }</p>
    </>
  );
};

export default DashboardPage;
