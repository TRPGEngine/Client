import config from '@shared/project.config';

/**
 * 初始化ws服务
 */
export function installServiceWorker() {
  if (config.environment === 'production' || config.devSW) {
    import('offline-plugin/runtime').then((OfflinePluginRuntime) =>
      OfflinePluginRuntime.install()
    );
  }
}
