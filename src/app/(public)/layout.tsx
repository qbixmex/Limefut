import type { FC, ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { Container, Footer, Header } from "./components";

export const metadata: Metadata = {
  title: {
    default: "Limefut - Liga menor de futbol",
    template: "%s - Limefut",
  },
  description: "Liga menor de futbol",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ]
  },
};

type Props = Readonly<{ children: ReactNode; }>

const PublicLayout: FC<Props> = ({ children }) => {
  return (
    <Container>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </Container>
  );
};

export default PublicLayout;
