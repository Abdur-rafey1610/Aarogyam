import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const PORT = 8080;
  const HOST = '0.0.0.0';
  const LOCAL_IP = '192.168.1.17'; // Replace with your computer's local IP

  return {
    base: isDev ? '/' : '/',
    server: {
      host: HOST,
      port: PORT,
      strictPort: true,
      open: `http://localhost:${PORT}`,
      cors: true,
      hmr: {
        protocol: 'ws',
        host: isDev ? 'localhost' : HOST,
        port: PORT,
      },
      proxy: {},
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      watch: {
        usePolling: true
      }
    },
    preview: {
      host: HOST,
      port: PORT,
      strictPort: true,
      https: undefined // Explicitly set to undefined to avoid type issues
    },
    plugins: [
      react(),
      isDev && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
      assetsInlineLimit: 0,
    },
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    }
  };
});
