import config from '@shared/project.config';

/**
 * 初始化ws服务
 */
export function installServiceWorker() {
  if (config.environment === 'production' || config.devSW) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
}
