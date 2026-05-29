import React, { Suspense } from "react";
import { Result, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface RemoteModuleLoaderProps {
  children: React.ReactNode;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RemoteModuleErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  private isChunkLoadError(error: Error | null): boolean {
    if (!error) return false;
    const msg = error.message.toLowerCase();
    return (
      msg.includes("loading chunk") ||
      msg.includes("failed to fetch") ||
      msg.includes("load failed") ||
      error.name === "ChunkLoadError"
    );
  }

  render() {
    if (this.state.hasError) {
      const isLoadError = this.isChunkLoadError(this.state.error);

      return (
        <Result
          status="error"
          title={isLoadError ? "子应用加载失败" : "子应用运行异常"}
          subTitle={
            isLoadError
              ? "请检查网络连接或确保子应用正常运行"
              : "子应用渲染时发生错误，请稍后重试"
          }
        />
      );
    }

    return this.props.children;
  }
}

const RemoteModuleLoader: React.FC<RemoteModuleLoaderProps> = ({
  children,
}) => {
  return (
    <RemoteModuleErrorBoundary>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} />} />
            <Typography.Paragraph className="mt-4">
              正在加载子应用...
            </Typography.Paragraph>
          </div>
        }
      >
        {children}
      </Suspense>
    </RemoteModuleErrorBoundary>
  );
};

export default RemoteModuleLoader;
