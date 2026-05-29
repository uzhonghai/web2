import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

const __dirname = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const port = Number(env.VITE_HOST_PORT || 4173);
  const origin = env.VITE_HOST_ORIGIN || `http://localhost:${port}`;
  const base = env.VITE_HOST_BASE || '/';
  
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
        name: 'host_app',
        // version-first 会在 Host 初始化时拉取所有 remoteEntry；改为 loaded-first 按需加载
        shareStrategy: 'loaded-first',
        // 避免启动时预加载 remote 模块；remote 在运行时通过 registerRemotes 注册
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
