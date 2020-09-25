import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { PWA_INSTALLED } from '@shared/utils/consts';
import _get from 'lodash/get';

const Button = styled.div`
  padding: 8px 16px;
  display: inline-flex;
  border-radius: 32px;
  text-align: center;
  cursor: pointer;
  background-color: rgb(239, 239, 239);

  img {
    height: 16px;
  }
`;

/**
 * PWA相关按钮
 * 仅会在chrome中出现
 */
export const PWAButton: React.FC = TMemo((props) => {
  const [pwaInstalled, setPwaInstalled] = useState(true); // 默认已安装(即不显示)
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    let installed = localStorage.getItem(PWA_INSTALLED) === 'yes';
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      installed = true;
    } else if (_get(window.navigator, 'standalone') === true) {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      installed = true;
    }

    setPwaInstalled(installed);
  }, []);

  useEffect(() => {
    const beforeinstallprompt = (e) => {
      deferredPromptRef.current = e;
    };
    const appinstalled = (e) => {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      setPwaInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', beforeinstallprompt);
    window.addEventListener('appinstalled', appinstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeinstallprompt);
      window.removeEventListener('appinstalled', appinstalled);
    };
  }, []);

  const handleInstallPWA = useCallback(() => {
    const deferredPrompt = deferredPromptRef.current;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(({ outcome }) => {
        if (outcome === 'accepted') {
          console.log('Your PWA has been installed');
        } else {
          console.log('User chose to not install your PWA');
        }
        deferredPromptRef.current = null;
      });
    }
  }, []);

  if (pwaInstalled === true) {
    return null;
  }

  return (
    <Button onClick={handleInstallPWA}>
      <img src="/src/web/assets/img/pwa-logo.svg" />
    </Button>
  );
});
PWAButton.displayName = 'PWAButton';
