declare module 'system/system' {
  import React from 'react';
  interface SystemProps {
    hostUser?: string;
    title?: string;
    embedded?: boolean;
  }
  const System: React.FC<SystemProps>;
  export default System;

  interface SubMenuItem {
    key: string;
    label: string;
    icon: string;
    order: number;
  }
  export const menuConfig: SubMenuItem[];
}