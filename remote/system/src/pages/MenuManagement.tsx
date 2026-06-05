import React from "react";
import { Card, Table, Tag, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const mockData = [
  { id: 1, name: "首页", path: "/", icon: "HomeOutlined", type: "menu" },
  { id: 2, name: "系统管理", path: "/system", icon: "SettingOutlined", type: "menu" },
  { id: 3, name: "用户管理", path: "/system/users", icon: "UserOutlined", type: "menu" },
];

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "菜单名称", dataIndex: "name", key: "name" },
  { title: "路径", dataIndex: "path", key: "path" },
  { title: "图标", dataIndex: "icon", key: "icon" },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    render: (type: string) => (
      <Tag color={type === "menu" ? "blue" : "green"}>
        {type === "menu" ? "菜单" : "按钮"}
      </Tag>
    ),
  },
  {
    title: "操作",
    key: "action",
    render: () => (
      <Space>
        <a>编辑</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const MenuManagement: React.FC = () => (
  <Card
    title="菜单管理"
    extra={<Button type="primary" icon={<PlusOutlined />}>新增菜单</Button>}
  >
    <Table columns={columns} dataSource={mockData} rowKey="id" />
  </Card>
);

export default MenuManagement;
