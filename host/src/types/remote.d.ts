declare module 'remote_app/RemoteApp' {
  import React from 'react';
  interface RemoteAppProps {
    hostUser?: string;
    title?: string;
    embedded?: boolean;
  }
  const RemoteApp: React.FC<RemoteAppProps>;
  export default RemoteApp;
}

declare module 'remote_app_2/RemoteApp2' {
  import React from 'react';
  interface RemoteApp2Props {
    hostUser?: string;
    title?: string;
    embedded?: boolean;
  }
  const RemoteApp2: React.FC<RemoteApp2Props>;
  export default RemoteApp2;
}
