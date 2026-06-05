import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const UserManagement = React.lazy(() => import("@/pages/userManagement"));
const RoleManagement = React.lazy(() => import("@/pages/RoleManagement"));
const MenuManagement = React.lazy(() => import("@/pages/MenuManagement"));

export { default as menuConfig } from "./menuConfig";
export type { SubMenuItem } from "./menuConfig";

const SystemApp: React.FC = () => (
  <React.Suspense fallback={null}>
    <Routes>
      <Route path="users" element={<UserManagement />} />
      <Route path="roles" element={<RoleManagement />} />
      <Route path="menus" element={<MenuManagement />} />
      <Route path="*" element={<Navigate to="users" replace />} />
    </Routes>
  </React.Suspense>
);

export default SystemApp;
