import React, { useEffect, useMemo } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { ConfigProvider, App as AntdApp, Layout, Menu, theme } from "antd";
import * as AntdIcons from "@ant-design/icons";
import zhCN from "antd/locale/zh_CN";
import { setMessageApi } from "session/request";
import SystemApp from "@/SystemApp";
import menuConfig from "@/menuConfig";

const { Sider, Content } = Layout;

const renderIcon = (iconName: string): React.ReactNode => {
  const Icon = (AntdIcons as unknown as Record<string, React.ComponentType>)[
    iconName
  ];
  return Icon ? <Icon /> : null;
};

const MessageApiSetter: React.FC = () => {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setMessageApi(message);
  }, [message]);
  return null;
};

const StandaloneLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = useMemo(
    () =>
      [...menuConfig]
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          key: `/${item.key}`,
          icon: renderIcon(item.icon),
          label: item.label,
        })),
    [],
  );

  const selectedKey =
    "/" + (location.pathname.split("/").filter(Boolean)[0] ?? menuConfig[0]?.key);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        style={{ background: token.colorBgContainer, overflowY: "auto" }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none" }}
        />
      </Sider>
      <Content style={{ overflowY: "auto", padding: 16 }}>
        <SystemApp />
      </Content>
    </Layout>
  );
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
        <StandaloneLayout />
      </BrowserRouter>
    </AntdApp>
  </ConfigProvider>
);

export default App;
