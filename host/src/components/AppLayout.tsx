import React, { useMemo, useState } from "react";
import { Layout, Menu, theme } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import * as AntdIcons from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { RemoteAppConfig } from "@/config/remoteApps";

const { Sider, Content } = Layout;

const { HomeOutlined, ApartmentOutlined } = AntdIcons;

const renderIcon = (iconName: string): React.ReactNode => {
  const Icon = (AntdIcons as unknown as Record<string, React.ComponentType>)[
    iconName
  ];
  if (!Icon) {
    return <ApartmentOutlined />;
  }
  return <Icon />;
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
    const staticItems: ItemType[] = [
      { key: "/", icon: <HomeOutlined />, label: "首页" },
    ];

    const remoteItems: ItemType[] = [...remoteApps]
      .sort((a, b) => a.menuOrder - b.menuOrder)
      .map((app) => {
        const subs = app.subMenuItems;
        if (subs && subs.length > 0) {
          return {
            key: app.routePath,
            icon: renderIcon(app.menuIcon),
            label: app.menuLabel,
            children: [...subs]
              .sort((a, b) => a.order - b.order)
              .map((sub) => ({
                key: `${app.routePath}/${sub.key}`,
                icon: renderIcon(sub.icon),
                label: sub.label,
              })),
          };
        }
        return {
          key: app.routePath,
          icon: renderIcon(app.menuIcon),
          label: app.menuLabel,
        };
      });

    return [...staticItems, ...remoteItems];
  }, [remoteApps]);

  const openKeys = useMemo(() => {
    for (const app of remoteApps) {
      if (
        app.subMenuItems?.length &&
        location.pathname.startsWith(app.routePath)
      ) {
        return [app.routePath];
      }
    }
    return [];
  }, [remoteApps, location.pathname]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: token.colorBgContainer,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
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
