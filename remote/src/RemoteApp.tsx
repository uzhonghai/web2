import React, { useEffect } from "react";
import { ConfigProvider, App as AntdApp } from "antd";
import { setMessageApi } from "@/utils/request";

const MessageApiSetter: React.FC = () => {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setMessageApi(message);
  }, [message]);
  return null;
};

const RemoteApp: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <MessageApiSetter />
        子应用1
      </AntdApp>
    </ConfigProvider>
  );
};

export default RemoteApp;
