"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="relative inline-flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-full)] p-1">
      <button
        onClick={() => setTheme("light")}
        className={`relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-full)] transition-all duration-200 ${
          theme === "light"
            ? "bg-[var(--accent)] text-white shadow-[var(--shadow-md)]"
            : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]"
        }`}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
      >
        <Sun className="w-4.5 h-4.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-full)] transition-all duration-200 ${
          theme === "dark"
            ? "bg-[var(--indigo)] text-white shadow-[var(--shadow-md)]"
            : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]"
        }`}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
      >
        <Moon className="w-4.5 h-4.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-full)] transition-all duration-200 ${
          theme === "system"
            ? "bg-[var(--fg)] text-[var(--bg)] shadow-[var(--shadow-md)]"
            : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]"
        }`}
        aria-label="System preference"
        aria-pressed={theme === "system"}
      >
        <Monitor className="w-4.5 h-4.5" />
      </button>
      {/* Subtle indicator of resolved theme */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center">
        {resolvedTheme === "dark" ? (
          <Moon className="w-3 h-3 text-[var(--indigo)]" />
        ) : (
          <Sun className="w-3 h-3 text-[var(--amber)]" />
        )}
      </div>
    </div>
  );
}