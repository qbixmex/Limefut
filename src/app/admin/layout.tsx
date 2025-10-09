import { FC } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Limefut - Admin",
  description: "Panel de administración",
  robots: "noindex, nofollow",
};

type Props = Readonly<{ children: React.ReactNode; }>;

export const AdminLayout: FC<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default AdminLayout;