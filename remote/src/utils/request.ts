import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { MessageInstance } from "antd/es/message/interface";

declare module "axios" {
  interface AxiosRequestConfig {
    /** 跳过统一响应拦截，直接返回原始 response.data */
    _rawResponse?: boolean;
  }
}

let messageApi: MessageInstance | null = null;

export function setMessageApi(api: MessageInstance) {
  messageApi = api;
}

const showError = (msg: string) => {
  messageApi?.error(msg);
};

/** 与后端约定的统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

const TOKEN_KEY = "session_id";

const SUCCESS_CODES = new Set([0, 200]);

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const session_id = localStorage.getItem(TOKEN_KEY);
    if (session_id) {
      config.headers["xmhis-session-id"] = session_id;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (response.config._rawResponse) {
      return body;
    }

    if (body == null || typeof body !== "object" || !("code" in body)) {
      return body;
    }

    const { code, data, message: msg } = body as ApiResponse;
    if (SUCCESS_CODES.has(code)) {
      return data !== undefined ? data : body;
    }

    showError(msg || "请求失败");
    return Promise.reject(new Error(msg || "请求失败"));
  },
  (error) => {
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;

    const statusMessageMap: Record<number, string> = {
      401: "未登录或登录已过期",
      403: "没有权限",
      404: "请求的资源不存在",
    };

    let msg = serverMsg;

    if (!msg) {
      if (status && statusMessageMap[status]) {
        msg = statusMessageMap[status];
      } else if (status && status >= 500) {
        msg = "服务器错误";
      } else {
        msg = error.message || "网络异常";
      }
    }

    showError(msg);

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject(error);
  },
);

const get = <T>(url: string, config?: AxiosRequestConfig) => {
  return instance.get<T, T>(url, config);
};

const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return instance.post<T, T>(url, data, config);
};

const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return instance.put<T, T>(url, data, config);
};

const del = <T>(url: string, config?: AxiosRequestConfig) => {
  return instance.delete<T, T>(url, config);
};

export const request = { get, post, put, delete: del };

export default instance;
