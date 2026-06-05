import { request } from "session/request";

// 获取用户列表
export const getUserList = (params: { page_no: number; page_size: number }) => {
  return request.post("user/GetUserList", params);
};

// 新增用户
export const newUser = (params: any) => {
  return request.post("user/NewUser", params);
};

// 删除用户
export const deleteUser = (params: { user_id: number }) => {
  return request.post("user/DeleteUser", params);
};

// 编辑用户
export const editUser = (params: any) => {
  return request.post("user/EditUser", params);
};
