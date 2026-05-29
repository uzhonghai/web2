import React, { useMemo, useState } from "react";
import { Layout, Menu, theme } from "antd";
import * as AntdIcons from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { RemoteAppConfig } from "@/config/remoteApps";

const { Sider, Content } = Layout;

const { HomeOutlined, ApartmentOutlined } = AntdIcons;

const renderIcon = (iconName: string): React.ReactNode => {
  const iconCandidate = (AntdIcons as Record<string, unknown>)[iconName];
  if (typeof iconCandidate !== "function") {
    return <ApartmentOutlined />;
  }
  return React.createElement(iconCandidate as React.ComponentType);
};

interface AppLayoutProps {
  children: React.ReactNode;
  remoteApps: RemoteAppConfig[];
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, remoteApps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const menuItems = useMemo(() => {
    const staticItems = [
      { key: "/", icon: <HomeOutlined />, label: "首页", order: 0 },
    ];

    const remoteItems = [...remoteApps]
      .sort((a, b) => a.menuOrder - b.menuOrder)
      .map((app) => ({
        key: app.routePath,
        icon: renderIcon(app.menuIcon),
        label: app.menuLabel,
        order: app.menuOrder,
      }));

    return [...staticItems, ...remoteItems];
  }, [remoteApps]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: token.colorBgContainer,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-center items-center font-bold text-xl tracking-wider h-10 m-2 bg-gradient-to-r from-sky-300/40 to-indigo-200/40 text-slate-800 shadow-inner rounded-2xl">
          智慧医院系统
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none" }}
        />
      </Sider>

      <Content className="min-w-0 flex-1 overflow-y-auto" style={{ margin: 0 }}>
        <div className="mx-auto w-full max-w-7xl px-4 py-4">{children}</div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
