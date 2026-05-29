import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import { setMessageApi } from "@/utils/request";
import { fetchRemoteApps, type RemoteAppConfig } from "@/config/remoteApps";
import { buildRemoteConfigs } from "@/config/remotes";
import AppRouter from "@/router";

const MessageApiSetter: React.FC = () => {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setMessageApi(message);
  }, [message]);
  return null;
};

const App: React.FC = () => {
  const [remoteApps, setRemoteApps] = useState<RemoteAppConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemoteApps().then((apps) => {
      buildRemoteConfigs(apps);
      setRemoteApps(apps);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <MessageApiSetter />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter remoteApps={remoteApps} />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
