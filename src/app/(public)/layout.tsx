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
  openGraph: {
    locale: "es_MX",
    type: "website",
    images: [
     {
       url: "https://limefut.netlify.app/liga-menor-de-futbol-black.webp",
       width: 500,
       height: 500,
       alt: "Liga menor de fútbol"
     },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limefut - Liga menor de futbol",
    description: "Liga menor de futbol para niños y jóvenes en México",
    images: [
      {
        url: "https://limefut.netlify.app/liga-menor-de-futbol-black.webp",
        width: 500,
        height: 500,
        alt: "Liga menor de futbol Limefut",
      },
    ],
  }
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
