export interface RemoteAppConfig {
  name: string; // MF 远程容器名称
  entry: string; // remoteEntry.js 的完整 URL
  moduleId: string; // Module Federation 模块 ID，如 "remote_app/RemoteApp"
  routePath: string; // 前端路由路径
  menuLabel: string; // 侧边栏菜单标题
  menuIcon: string; // antd 图标名称
  menuOrder: number; // 菜单排序（升序）
}

/**
 * 模拟后端接口返回的子应用配置列表
 * TODO: 替换为真实接口调用，如 request.get('/api/remote-apps')
 */
const MOCK_REMOTE_APPS: RemoteAppConfig[] = [
  {
    name: "remote_app",
    entry: import.meta.env.VITE_REMOTE_A_ENTRY ?? "",
    moduleId: "remote_app/RemoteApp",
    routePath: "/remote-app",
    menuLabel: "整应用展示",
    menuIcon: "ApartmentOutlined",
    menuOrder: 1,
  },
  {
    name: "remote_app_2",
    entry: import.meta.env.VITE_REMOTE_A_ENTRY2 ?? "",
    moduleId: "remote_app_2/RemoteApp2",
    routePath: "/remote-app-2",
    menuLabel: "整应用展示2",
    menuIcon: "ApartmentOutlined",
    menuOrder: 2,
  },
];

let _remoteApps: RemoteAppConfig[] = [];

/**
 * 加载远程子应用配置（当前使用静态 mock 数据）
 * 后续接入真实接口时只需将 MOCK_REMOTE_APPS 替换为 API 调用
 */
export const fetchRemoteApps = async (): Promise<RemoteAppConfig[]> => {
  // TODO: 替换为真实接口
  // const res = await request.get<RemoteAppConfig[]>('/api/remote-apps');
  // _remoteApps = res.data;
  _remoteApps = MOCK_REMOTE_APPS;
  return _remoteApps;
}

export const getRemoteApps = (): RemoteAppConfig[] => {
  return _remoteApps;
};
