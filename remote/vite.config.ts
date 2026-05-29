import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

const __dirname = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const port = Number(env.VITE_REMOTE_A_PORT || 4174);
  const origin = env.VITE_REMOTE_A_ORIGIN || `http://localhost:${port}`;
  const base = env.VITE_REMOTE_A_BASE || '/';

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
        name: 'remote_app',
        filename: 'remoteEntry.js',
        exposes: {
          './RemoteApp': './src/RemoteApp.tsx',
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
