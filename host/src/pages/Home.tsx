import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <Card
      className="overflow-hidden shadow-sm text-center"
      style={{ marginBottom: 24 }}
    >
      <Title level={3}>智慧医院系统0605-1</Title>
    </Card>
  );
};

export default Home;
