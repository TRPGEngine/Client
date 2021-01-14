import config from '@shared/project.config';
import { Button, notification } from 'antd';
import React from 'react';
import { t } from '@shared/i18n';

/**
 * 弹出更新提示框
 */
function handleShowUpdateTip() {
  notification.open({
    message: t('更新版本'),
    description: t('检测到有新版本, 是否立即刷新以升级到最新内容'),
    btn: React.createElement(
      Button,
      {
        type: 'primary',
        size: 'small',
        onClick: () => {
          window.location.reload();
        },
      },
      [t('立即刷新')]
    ),
  });
}

/**
 * 处理registration相关任务和状态
 */
function handleRegistration(registration: ServiceWorkerRegistration) {
  console.log('registered');
  console.log('registered', registration);
  if (registration.waiting) {
    console.log('updated', registration);
    handleShowUpdateTip();
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
          handleShowUpdateTip();
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
