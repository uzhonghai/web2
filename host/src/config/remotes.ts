import type { RemoteAppConfig } from '@/config/remoteApps';

export interface RemoteConfig {
  name: string;
  entry: string;
  entryGlobalName: string;
  type: 'module';
  shareScope: 'default';
}

const MF_DEFAULTS = { type: 'module' as const, shareScope: 'default' as const };

const _dynamicConfigs = new Map<string, Omit<RemoteConfig, 'type' | 'shareScope'>>();

export const buildRemoteConfigs = (apps: RemoteAppConfig[]): void => {
  _dynamicConfigs.clear();
  for (const app of apps) {
    _dynamicConfigs.set(app.name, {
      name: app.name,
      entry: app.entry,
      entryGlobalName: app.name,
    });
  }
};

export const getRemoteConfig = (remoteName: string): RemoteConfig | undefined => {
  const cfg = _dynamicConfigs.get(remoteName);
  return cfg ? { ...cfg, ...MF_DEFAULTS } : undefined;
};

export const getRemoteNameFromModuleId = (moduleId: string): string => {
  if (!moduleId) throw new Error('moduleId must not be empty');
  const slashIndex = moduleId.indexOf('/');
  return slashIndex === -1 ? moduleId : moduleId.slice(0, slashIndex);
};