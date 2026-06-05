import { request } from "session/request";

// 登录
export const login = (params: { user_no: string; user_pwd: string }) => {
  return request.post("/auth/Login", params, {
    headers: {
      "xmhis-session-id": "xmhis.session.default",
    },
  });
};

// 退出登录
export const logout = (params: { session_id: string }) => {
  return request.post("/auth/Logout", params);
};

// 获取会话信息
export const getSessionInfo = (params: { session_id: string }) => {
  return request.post("/auth/GetSessionInfo", params);
};
