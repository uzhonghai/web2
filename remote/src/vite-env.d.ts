/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_REMOTE_A_PORT?: string;
  readonly VITE_REMOTE_A_ORIGIN?: string;
  readonly VITE_REMOTE_A_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
