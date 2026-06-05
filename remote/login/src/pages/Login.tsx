import React from "react";
import { Form, Input, Button, Typography, App } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import { setSessionId } from "session/request";
import "./Login.scss";

const { Title, Text } = Typography;

interface LoginForm {
  user_no: string;
  user_pwd: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res: any = await login(values);
      if (res?.session_id) {
        setSessionId(res.session_id);
      }
      message.success("登录成功");
      navigate("/", { replace: true });
    } catch {
      // request.ts 统一处理错误提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__logo">
            <SafetyCertificateOutlined className="login-page__logo-icon" />
          </div>
          <Title level={3} className="login-page__title">
            智慧医院信息系统
          </Title>
          <Text className="login-page__subtitle">
            Hospital Information System
          </Text>
        </div>

        <Form<LoginForm>
          name="login"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="user_no"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input
              className="login-page__input"
              prefix={<UserOutlined className="login-page__field-icon" />}
              placeholder="请输入账号"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="user_pwd"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              className="login-page__input"
              prefix={<LockOutlined className="login-page__field-icon" />}
              placeholder="请输入密码"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item className="login-page__submit-item">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-page__submit-btn"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-page__footer">
          <Text className="login-page__copyright">© 2026 智慧医院信息系统</Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
