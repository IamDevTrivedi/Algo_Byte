import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light", // default
  initializeTheme: () => {
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme) {
      set({ theme: savedTheme });
    }
  },
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
