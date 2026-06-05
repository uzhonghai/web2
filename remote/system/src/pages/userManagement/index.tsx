import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Space, Button, Popconfirm } from "antd";
import { getUserList, newUser, deleteUser, editUser } from "@/api/user";

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserList = async () => {
    setLoading(true);
    const res: any = await getUserList({
      page_no: 1,
      page_size: 30,
    });
    setUserList(res.user_list);
    setLoading(false);
  };

  const handleDeleteUser = async (record: any) => {
    const res: any = await deleteUser({
      user_id: record.user_id,
    });
    console.log(res);
  };

  const handleEditUser = async (record: any) => {
    console.log(record);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const columns: any = [
    { title: "姓名", dataIndex: "user_name", key: "user_name", fixed: "left" },
    { title: "ID", dataIndex: "user_id", key: "user_id" },
    {
      title: "性别",
      dataIndex: "user_gender",
      key: "user_gender",
      render: (user_gender: string) => {
        const genderMap: Record<string, { color: string; text: string }> = {
          男: { color: "blue", text: "男" },
          女: { color: "pink", text: "女" },
        };
        const { color, text } = genderMap[user_gender] || {
          color: "default",
          text: user_gender || "未知",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "机构名称", dataIndex: "org_name", key: "org_name" },
    { title: "科室名称", dataIndex: "dept_name", key: "dept_name" },
    { title: "用户工号", dataIndex: "user_no", key: "user_no" },
    { title: "用户代码", dataIndex: "user_code", key: "user_code" },
    { title: "电话", dataIndex: "user_telno", key: "user_telno" },
    { title: "身份证号", dataIndex: "user_idno", key: "user_idno" },
    { title: "出生日期", dataIndex: "user_dob", key: "user_dob" },
    { title: "标识", dataIndex: "user_tag", key: "user_tag" },
    { title: "备注", dataIndex: "user_note", key: "user_note" },
    { title: "工作类型", dataIndex: "work_type", key: "work_type" },
    { title: "入职日期", dataIndex: "work_date", key: "work_date" },
    { title: "职务", dataIndex: "work_title", key: "work_title" },
    { title: "聘用职称", dataIndex: "work_level", key: "work_level" },
    { title: "技能等级", dataIndex: "skill_level", key: "skill_level" },
    { title: "排序号", dataIndex: "sort_no", key: "sort_no" },
    {
      title: "状态",
      dataIndex: "valid_status",
      key: "valid_status",
      render: (valid_status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          "1": { color: "green", text: "有效" },
          "0": { color: "volcano", text: "删除" },
          x: { color: "orange", text: "锁定" },
        };
        const { color, text } = statusMap[valid_status] || {
          color: "default",
          text: "未知",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "有效期开始", dataIndex: "valid_start", key: "valid_start" },
    { title: "有效期结束", dataIndex: "valid_end", key: "valid_end" },
    { title: "录入时间", dataIndex: "input_time", key: "input_time" },
    { title: "录入备注", dataIndex: "input_note", key: "input_note" },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: (record: any) => (
        <Space>
          <Button
            color="primary"
            variant="solid"
            size="small"
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDeleteUser(record)}
          >
            <Button danger size="small" type="default">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="user_id"
        columns={columns}
        dataSource={userList}
        scroll={{ x: "max-content" }}
        loading={loading}
      />
    </>
  );
};

export default UserManagement;
