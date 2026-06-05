/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SESSION_PORT?: string;
  readonly VITE_SESSION_ORIGIN?: string;
  readonly VITE_SESSION_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
