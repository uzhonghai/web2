import { defineConfig, loadEnv } from 'vite';
import { federation } from '@module-federation/vite';

const __dirname = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const port = Number(env.VITE_SESSION_PORT || 4172);
  const origin = env.VITE_SESSION_ORIGIN || `http://localhost:${port}`;
  const base = env.VITE_SESSION_BASE || '/';

  return {
    base,
    resolve: {
      alias: {
        '@': decodeURIComponent(new URL('./src', import.meta.url).pathname),
      },
    },
    plugins: [
      federation({
        name: 'session',
        filename: 'session.js',
        exposes: {
          './request': './src/request.ts',
        },
        shareStrategy: 'loaded-first',
        manifest: {
          disableAssetsAnalyze: true,
        },
        dev: {
          disableDynamicRemoteTypeHints: true,
        },
        shared: {
          axios: { singleton: true },
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
