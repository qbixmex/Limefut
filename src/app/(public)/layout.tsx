import type { FC, ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { Container, Footer, Header } from "./components";

const DOMAIN = process.env.DOMAIN ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: "Limefut - Liga menor de futbol",
    template: "%s - Limefut",
  },
  description: "Liga menor de futbol",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  openGraph: {
    locale: "es_MX",
    type: "website",
    images: [
     {
       url: `${DOMAIN}/limefut-logo-1200-x-630.webp`,
       width: 1200,
       height: 630,
       alt: "Liga menor de fútbol",
     },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limefut - Liga menor de futbol",
    description: "Liga menor de futbol para niños y jóvenes en México",
    images: [
      {
        url: `${DOMAIN}/limefut-logo-1200-x-630.webp`,
        width: 1200,
        height: 630,
        alt: "Liga menor de futbol Limefut",
      },
    ],
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
