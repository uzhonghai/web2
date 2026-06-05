import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import { setMessageApi } from "session/request";
import LoginApp from "@/LoginApp";

const MessageApiSetter: React.FC = () => {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setMessageApi(message);
  }, [message]);
  return null;
};

const App: React.FC = () => (
  <ConfigProvider
    locale={zhCN}
    theme={{
      token: { colorPrimary: "#1677ff", borderRadius: 6 },
    }}
  >
    <AntdApp>
      <MessageApiSetter />
      <BrowserRouter>
        <LoginApp />
      </BrowserRouter>
    </AntdApp>
  </ConfigProvider>
);

export default App;
