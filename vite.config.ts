import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    host: '0.0.0.0', // Allows access from Codespaces preview / network
    // Optional: Helps fix HMR WebSocket issues in Codespaces
    hmr: {
      clientPort: 443, // Use HTTPS port for WebSocket (common Codespaces fix)
    },
  },

  resolve: {
    alias: {
      // Standard convention: @ → src folder
      '@': path.resolve(__dirname, './src'),
    },
  },

  // No need to define process.env here anymore!
  // We use import.meta.env.VITE_GROQ_API_KEY directly in code
  // (Vite automatically exposes variables prefixed with VITE_)
});