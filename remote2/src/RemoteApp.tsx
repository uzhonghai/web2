import React, { useState } from "react";
import "./tailwind.css";
import { ConfigProvider } from "antd";

const RemoteApp2: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      子应用2
    </ConfigProvider>
  );
};

export default RemoteApp2;
