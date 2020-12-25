import config from '@shared/project.config';

/**
 * 处理registration相关任务和状态
 */
function handleRegistration(registration: ServiceWorkerRegistration) {
  console.log('registered');
  console.log('registered', registration);
  if (registration.waiting) {
    console.log('updated', registration);
    return;
  }
  registration.onupdatefound = () => {
    console.log('updatefound', registration);
    const installingWorker = registration.installing;
    if (installingWorker === null) {
      return;
    }

    installingWorker.onstatechange = () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // At this point, the old content will have been purged and
          // the fresh content will have been added to the cache.
          // It's the perfect time to display a "New content is
          // available; please refresh." message in your web app.
          console.log('updated', registration);
        } else {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          console.log('cached', registration);
        }
      }
    };
  };
}

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

            handleRegistration(registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
}
