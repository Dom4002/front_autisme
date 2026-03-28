import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // 1. Déclarer le plugin Tailwind ici pour qu'il soit activé
  plugins: [tailwindcss()],

  // 2. Configuration du build
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        about: "./about.html",
        programs: "./programs.html",
        parents: "./parents.html",
        enroll: "./enroll.html",
        donate: "./donate.html",
      },
    },
  },
});
