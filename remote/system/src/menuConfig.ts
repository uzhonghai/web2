export interface SubMenuItem {
  key: string;
  label: string;
  icon: string;
  order: number;
}

const menuConfig: SubMenuItem[] = [
  { key: "users", label: "用户管理", icon: "UserOutlined", order: 1 },
  { key: "roles", label: "角色管理", icon: "TeamOutlined", order: 2 },
  { key: "menus", label: "菜单管理", icon: "MenuOutlined", order: 3 },
];

export default menuConfig;
