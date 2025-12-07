"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./icons";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark class is present on document
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <button className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isDark
          ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-100"
          : "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0"
      }`} />

      {/* Sun icon */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
      }`}>
        <SunIcon className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
      </div>

      {/* Moon icon */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
      }`}>
        <MoonIcon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
      </div>
    </button>
  );
}
