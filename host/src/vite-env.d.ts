/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_HOST_PORT?: string;
  readonly VITE_HOST_ORIGIN?: string;
  readonly VITE_HOST_BASE?: string;
  readonly VITE_LOGIN_ENTRY?: string;
  readonly VITE_SYSTEM_ENTRY?: string;
  readonly VITE_SESSION_ENTRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
