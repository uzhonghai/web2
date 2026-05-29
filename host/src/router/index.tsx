import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import createRemotePage from "@/remote/createRemotePage";
import type { RemoteAppConfig } from "@/config/remoteApps";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const session_id = localStorage.getItem("session_id");
  if (!session_id) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const remotePageCache = new Map<string, React.FC>();

const getRemotePage = (app: RemoteAppConfig): React.FC => {
  const cached = remotePageCache.get(app.moduleId);
  if (cached) return cached;

  const Page = createRemotePage({
    remoteId: app.moduleId,
    displayName: `Remote_${app.name}`,
  });
  remotePageCache.set(app.moduleId, Page);
  return Page;
};

const AppRouter: React.FC<{ remoteApps: RemoteAppConfig[] }> = ({
  remoteApps,
}) => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/*"
      element={
        <RequireAuth>
          <AppLayout remoteApps={remoteApps}>
            <Routes>
              <Route path="/" element={<Home />} />
              {remoteApps.map((app) => {
                const Page = getRemotePage(app);
                return (
                  <Route
                    key={app.name}
                    path={app.routePath}
                    element={<Page />}
                  />
                );
              })}
            </Routes>
          </AppLayout>
        </RequireAuth>
      }
    />
  </Routes>
);

export default AppRouter;
