import React from "react";
import { Card, Table, Tag, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const mockData = [
  { id: 1, name: "管理员", code: "admin", userCount: 3 },
  { id: 2, name: "编辑", code: "editor", userCount: 12 },
  { id: 3, name: "访客", code: "guest", userCount: 45 },
];

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "角色名称", dataIndex: "name", key: "name" },
  {
    title: "角色编码",
    dataIndex: "code",
    key: "code",
    render: (code: string) => <Tag color="blue">{code}</Tag>,
  },
  { title: "用户数", dataIndex: "userCount", key: "userCount" },
  {
    title: "操作",
    key: "action",
    render: () => (
      <Space>
        <a>编辑</a>
        <a>权限配置</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const RoleManagement: React.FC = () => (
  <Card
    title="角色管理"
    extra={<Button type="primary" icon={<PlusOutlined />}>新增角色</Button>}
  >
    <Table columns={columns} dataSource={mockData} rowKey="id" />
  </Card>
);

export default RoleManagement;
