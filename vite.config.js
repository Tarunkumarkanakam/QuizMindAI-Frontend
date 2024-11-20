import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: '/quiz/',  // Set your context path here
  server: {
    watch: {
      usePolling: true
    },
    host: '0.0.0.0', // Ensure Vite server is accessible from the host machine
    strictPort: true,
    port: 5173 // Match the exposed port
  }
});
