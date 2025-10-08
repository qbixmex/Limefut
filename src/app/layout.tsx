import { FC } from "react";
import type { Metadata } from "next";
import { openSans, arimo } from "./fonts";
import "./globals.css";
import { Header, Container, Footer } from "./(components)";
import { ThemeProvider } from "@/components/theme-provider";

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

type Props = Readonly<{ children: React.ReactNode; }>

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${fonts.join(' ')} antialiased`}>
        <Container>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 flex">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </Container>
      </body >
    </html >
  );
};

export default RootLayout;
