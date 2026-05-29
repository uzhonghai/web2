import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const envDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
  const env = loadEnv(mode, envDir, '');
  const port = Number(env.VITE_REMOTE_A_PORT || 4175);
  const origin = env.VITE_REMOTE_A_ORIGIN || `http://localhost:${port}`;
  const base = env.VITE_REMOTE_A_BASE || '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'remote_app_2',
        filename: 'remoteEntry2.js',
        exposes: {
          './RemoteApp2': './src/RemoteApp.tsx',
        },
        dev: {
          disableDynamicRemoteTypeHints: true,
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
          antd: { singleton: true },
        },
      }),
    ],
    server: {
      port,
      origin,
    },
    build: {
      target: 'esnext',
      minify: false,
    },
  };
});
