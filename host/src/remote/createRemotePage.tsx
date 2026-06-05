import React from "react";
import RemoteModuleLoader from "./RemoteModuleLoader";
import { loadRemoteModule } from "./loadRemoteModule";
import type { SubMenuItem } from "@/config/remoteApps";

interface CreateRemotePageOptions {
  remoteId: string;
  displayName?: string;
  onMenuLoaded?: (menuItems: SubMenuItem[]) => void;
}

const createRemotePage = (options: CreateRemotePageOptions) => {
  const RemoteComponent = React.lazy(() =>
    loadRemoteModule(options.remoteId).then((mod) => {
      if (mod.menuConfig && options.onMenuLoaded) {
        options.onMenuLoaded(mod.menuConfig);
      }
      return mod;
    }),
  );

  const RemotePage: React.FC = (props) => {
    const content = React.createElement(RemoteComponent, props);

    return <RemoteModuleLoader>{content}</RemoteModuleLoader>;
  };

  RemotePage.displayName = options.displayName ?? "RemotePage";

  return RemotePage;
};

export default createRemotePage;
