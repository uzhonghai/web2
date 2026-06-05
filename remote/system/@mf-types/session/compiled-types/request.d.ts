import { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { MessageInstance } from "antd/es/message/interface";
declare module "axios" {
    interface AxiosRequestConfig {
        /** 跳过统一响应拦截，直接返回原始 response.data */
        rawResponse?: boolean;
    }
}
export declare function setMessageApi(api: MessageInstance): void;
/** 与后端约定的统一响应结构 */
export interface ApiResponse {
    code: number;
    message: string;
}
declare const instance: AxiosInstance;
export declare const request: {
    get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
    delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
};
export declare const TOKEN_STORAGE_KEY = "session_id";
export declare const getSessionId: () => string | null;
export declare const setSessionId: (id: string) => void;
export declare const clearSessionId: () => void;
export default instance;
