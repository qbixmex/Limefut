// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

type Props = { readonly children?: ReactNode; };

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    // <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    // </SessionProvider>
  );
};

export default Providers;