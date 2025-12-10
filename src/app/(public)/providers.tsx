import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

type Props = { readonly children?: ReactNode; };

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{ style: { width: 400 }}}
        richColors
      />
    </ThemeProvider>
  );
};

export default Providers;