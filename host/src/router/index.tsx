import React, { useCallback, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Home from "@/pages/Home";
import createRemotePage from "@/remote/createRemotePage";
import RemoteModuleLoader from "@/remote/RemoteModuleLoader";
import { loadRemoteModule } from "@/remote/loadRemoteModule";
import type { RemoteAppConfig, SubMenuItem } from "@/config/remoteApps";
import { getSessionId } from "session/request";

const RemoteLogin = React.lazy(() => loadRemoteModule("login/Login"));

const Login: React.FC = () => (
  <RemoteModuleLoader>
    <RemoteLogin />
  </RemoteModuleLoader>
);

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const session_id = getSessionId();
  if (!session_id) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const remotePageCache = new Map<string, React.FC>();

const AppRouter: React.FC<{ remoteApps: RemoteAppConfig[] }> = ({
  remoteApps,
}) => {
  const [appsWithMenus, setAppsWithMenus] = useState<RemoteAppConfig[]>(remoteApps);

  const handleMenuLoaded = useCallback(
    (appName: string, menuItems: SubMenuItem[]) => {
      setAppsWithMenus((prev) =>
        prev.map((app) =>
          app.name === appName ? { ...app, subMenuItems: menuItems } : app,
        ),
      );
    },
    [],
  );

  const getRemotePage = useCallback(
    (app: RemoteAppConfig): React.FC => {
      const cached = remotePageCache.get(app.moduleId);
      if (cached) return cached;

      const Page = createRemotePage({
        remoteId: app.moduleId,
        displayName: `Remote_${app.name}`,
        onMenuLoaded: (items) => handleMenuLoaded(app.name, items),
      });
      remotePageCache.set(app.moduleId, Page);
      return Page;
    },
    [handleMenuLoaded],
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout remoteApps={appsWithMenus}>
              <Routes>
                <Route path="/" element={<Home />} />
                {remoteApps.map((app) => {
                  const Page = getRemotePage(app);
                  return (
                    <Route
                      key={app.name}
                      path={`${app.routePath}/*`}
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
};

export default AppRouter;
