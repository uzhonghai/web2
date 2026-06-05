import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

const __dirname = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const port = Number(env.VITE_SYSTEM_PORT || 4175);
  const origin = env.VITE_SYSTEM_ORIGIN || `http://localhost:${port}`;
  const base = env.VITE_SYSTEM_BASE || '/';
  const sessionEntry = env.VITE_SESSION_ENTRY || 'http://localhost:4172/session.js';

  return {
    base,
    resolve: {
      alias: {
        '@': decodeURIComponent(new URL('./src', import.meta.url).pathname),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'system',
        filename: 'system.js',
        exposes: {
          './system': './src/SystemApp.tsx',
        },
        remotes: {
          session: {
            type: 'module',
            name: 'session',
            entry: sessionEntry,
            entryGlobalName: 'session',
            shareScope: 'default',
          },
        },
        shareStrategy: 'loaded-first',
        manifest: {
          disableAssetsAnalyze: true,
        },
        dev: {
          disableDynamicRemoteTypeHints: true,
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
          antd: { singleton: true },
          axios: { singleton: true },
        },
      }),
    ],
    server: {
      port,
      origin,
      proxy: {
        '/api': {
          target: 'https://xmhis.top:30101',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      target: 'esnext',
      minify: false,
    },
  };
});
