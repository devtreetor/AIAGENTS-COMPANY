"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

// Default context for SSR/prerendering
const defaultContext: ThemeContextType = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    const initialTheme = stored || "system";
    setThemeState(initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const resolveTheme = (t: Theme) => {
      if (t === "system") {
        return mediaQuery.matches ? "dark" : "light";
      }
      return t;
    };

    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newResolved = e.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
        document.documentElement.classList.toggle("dark", newResolved === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const resolved = newTheme === "system" ? (mediaQuery.matches ? "dark" : "light") : newTheme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  };

  // Always provide context, use default values before mount
  const contextValue: ThemeContextType = {
    theme: mounted ? theme : "system",
    resolvedTheme: mounted ? resolvedTheme : "light",
    setTheme: mounted ? setTheme : () => {},
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}