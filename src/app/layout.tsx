import type { FC, ReactNode } from "react";
import { openSans, arimo } from "@/app/(public)/fonts";
import "@/app/globals.css";
import { Providers } from "./(public)/providers";

type Props = Readonly<{ children: ReactNode; }>

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${openSans.variable} ${arimo.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
