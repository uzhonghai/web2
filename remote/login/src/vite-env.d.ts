/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_LOGIN_PORT?: string;
  readonly VITE_LOGIN_ORIGIN?: string;
  readonly VITE_LOGIN_BASE?: string;
  readonly VITE_SESSION_ENTRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
