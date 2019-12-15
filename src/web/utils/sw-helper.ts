import config from '@shared/project.config';

/**
 * 初始化ws服务
 */
export function installServiceWorker() {
  if (config.environment === 'production') {
    import('offline-plugin/runtime').then((OfflinePluginRuntime) =>
      OfflinePluginRuntime.install()
    );
  }
}
