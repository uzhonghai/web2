import { request } from "@/utils/request";

export const login = (params: { user_no: string; user_pwd: string }) => {
  return request.post("/auth/Login", params, {
    headers: {
      "xmhis-session-id": "xmhis.session.default",
    },
  });
};

export const getSessionInfo = (params: { session_id: string }) => {
  return request.post("/auth/GetSessionInfo", params);
};
