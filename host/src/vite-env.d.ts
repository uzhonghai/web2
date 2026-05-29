/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_HOST_PORT?: string;
  readonly VITE_HOST_ORIGIN?: string;
  readonly VITE_HOST_BASE?: string;
  readonly VITE_REMOTE_A_ENTRY?: string;
  readonly VITE_REMOTE_A_ENTRY2?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
