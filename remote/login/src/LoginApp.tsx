import React from "react";
import Login from "@/pages/Login";

/**
 * 暴露给 host 的登录入口
 * - 不再创建 Router/Provider，直接复用 host 提供的 React Router 与 antd 上下文
 * - 仅渲染登录页面组件本身
 */
const LoginApp: React.FC = () => {
  return <Login />;
};

export default LoginApp;
