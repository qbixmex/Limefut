import type { FC, ReactNode } from "react";
import { openSans, arimo } from "@/app/(public)/fonts";
import "@/app/globals.css";
import { Providers } from "./(public)/providers";

type Props = Readonly<{ children: ReactNode; }>

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${openSans.variable} ${arimo.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
