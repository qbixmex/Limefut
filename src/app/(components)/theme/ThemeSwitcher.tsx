'use client';

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {theme === "light" ? (
        <button onClick={() => setTheme("dark")}>
          <Moon size={20} className="text-green-50" />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <Sun size={20} className="text-green-50" />
        </button>
      )}
    </div>
  );
};

export default ThemeSwitcher;
