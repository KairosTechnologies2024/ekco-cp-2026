

import  { createContext, useContext, useState, useEffect } from "react";
import type{ ReactNode } from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // On mount, sync with current body class or set dark by default
    if (typeof document !== "undefined") {
      const body = document.body;
      if (body.classList.contains("dark-theme")) setIsDarkTheme(true);
      else if (body.classList.contains("light-theme")) setIsDarkTheme(false);
      else {
        setIsDarkTheme(true);
        body.classList.add("dark-theme");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const body = document.body;
      body.classList.remove(isDarkTheme ? "light-theme" : "dark-theme");
      body.classList.add(isDarkTheme ? "dark-theme" : "light-theme");
    }
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
