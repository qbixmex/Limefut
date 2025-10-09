import { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { openSans, arimo } from "@/app/(public)/fonts";
import "@/app/globals.css";
import { Providers } from "./(public)/providers";

const fonts = [openSans.variable, arimo.variable];

export const metadata: Metadata = {
  title: "Limefut",
  description: "Liga menor de futbol",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ]
  },
};

type Props = Readonly<{ children: ReactNode; }>

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${fonts.join(' ')} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
