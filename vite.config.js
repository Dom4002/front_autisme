import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        programs: './programs.html',
        parents: './parents.html',
        enroll: './enroll.html',
        donate: './donate.html',
        admin: './admin.html',
        login: './login.html'
      }
    }
  }
});
