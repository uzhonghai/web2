import { request } from "session/request";

// 获取机构列表
export const getOrgList = (params: null) => {
  return request.post("org/GetOrgList", params);
};
