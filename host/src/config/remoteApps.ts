export interface SubMenuItem {
  key: string;
  label: string;
  icon: string;
  order: number;
}

export interface RemoteAppConfig {
  name: string; // MF 远程容器名称
  entry: string; // remoteEntry.js 的完整 URL
  moduleId: string; // Module Federation 模块 ID，如 "remote_app/RemoteApp"
  routePath: string; // 前端路由路径
  menuLabel: string; // 侧边栏菜单标题
  menuIcon: string; // antd 图标名称
  menuOrder: number; // 菜单排序（升序）
  subMenuItems?: SubMenuItem[]; // 子应用暴露的二级菜单
}

/**
 * 模拟后端接口返回的子应用配置列表
 * TODO: 替换为真实接口调用
 */
const MOCK_REMOTE_APPS: RemoteAppConfig[] = [
  {
    name: "system",
    entry: import.meta.env.VITE_SYSTEM_ENTRY ?? "",
    moduleId: "system/system",
    routePath: "/system",
    menuLabel: "系统管理",
    menuIcon: "SettingOutlined",
    menuOrder: 1,
  },
];

let _remoteApps: RemoteAppConfig[] = [];

/**
 * 加载远程子应用配置（当前使用静态 mock 数据）
 * 后续接入真实接口时将 MOCK_REMOTE_APPS 替换为 API 调用
 */
export const fetchRemoteApps = async (): Promise<RemoteAppConfig[]> => {
  // TODO: 替换为真实接口
  _remoteApps = MOCK_REMOTE_APPS;
  return _remoteApps;
}

export const getRemoteApps = (): RemoteAppConfig[] => {
  return _remoteApps;
};
